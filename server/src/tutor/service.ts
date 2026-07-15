import path from "node:path";
import type { Response } from "express";
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import type { AssistanceLevel, Lesson, RunResult, Settings } from "@teacher/shared";
import { DEFAULT_SETTINGS } from "@teacher/shared";
import { buildPlacementPrompt, buildPlaygroundPrompt, buildSystemPrompt, wrapTurn } from "./prompts.js";
import { sdkEnv } from "./judge.js";
import { runLocal } from "../runner/localRunner.js";
import { evaluateDomAssertions } from "../runner/domCheck.js";
import { runCheckPass } from "../checks/run.js";
import { completeLesson } from "../store/progress.js";
import { appendJournal, appendProfileNote, getProfile } from "../store/profile.js";
import { readJson, writeJson } from "../store/jsonStore.js";

// ---------- SSE hub ----------

export type SseEvent =
  | { type: "text-delta"; text: string }
  | { type: "tool-use"; name: string; detail?: string }
  | { type: "check-results"; checks: unknown[]; completed: boolean }
  | { type: "hint"; index: number }
  | { type: "doc"; slug: string }
  | { type: "complete" }
  | { type: "turn-end" }
  | { type: "recommendation"; unitId: string; assistanceLevel: number; reasoning: string }
  | { type: "error"; message: string };

class SseHub {
  private clients = new Map<string, Set<Response>>();

  subscribe(key: string, res: Response): () => void {
    if (!this.clients.has(key)) this.clients.set(key, new Set());
    this.clients.get(key)!.add(res);
    return () => this.clients.get(key)?.delete(res);
  }

  send(key: string, event: SseEvent): void {
    for (const res of this.clients.get(key) ?? []) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  heartbeat(): void {
    for (const set of this.clients.values()) {
      for (const res of set) res.write(": ping\n\n");
    }
  }
}

export const hub = new SseHub();
setInterval(() => hub.heartbeat(), 15_000).unref();

// ---------- session plumbing ----------

interface QueuedTurn {
  wrapped: string;
}

class AsyncQueue<T> {
  private items: T[] = [];
  private waiters: ((v: T) => void)[] = [];
  private closed = false;

  push(item: T): void {
    const waiter = this.waiters.shift();
    if (waiter) waiter(item);
    else this.items.push(item);
  }

  close(): void {
    this.closed = true;
    // Wake pending waiters with no more input — generator ends.
    for (const w of this.waiters.splice(0)) w(undefined as T);
  }

  async next(): Promise<T | undefined> {
    if (this.items.length > 0) return this.items.shift();
    if (this.closed) return undefined;
    return new Promise<T>((resolve) => this.waiters.push(resolve));
  }
}

export type SessionMode = "lesson" | "playground" | "placement";

export interface PlacementInfo {
  trackTitle: string;
  units: { id: string; title: string; tier: string; summary: string }[];
}

interface TutorSession {
  key: string;
  lesson: Lesson;
  mode: SessionMode;
  placementInfo?: PlacementInfo;
  level: AssistanceLevel;
  levelChanged: boolean;
  latestFiles: Record<string, string>;
  lastRun: RunResult | null;
  queue: AsyncQueue<QueuedTurn>;
  done: Promise<void>;
}

export interface TutorDeps {
  dataDir: string;
  contentDir: string;
  getSolution: (key: string) => Promise<Record<string, string> | null>;
  getDocSlugs: () => Promise<string[]>;
  getSettings: () => Promise<Settings>;
}

const sessions = new Map<string, TutorSession>();

function sessionFile(dataDir: string, key: string): string {
  return path.join(dataDir, "sessions", `${key.replaceAll("/", "__")}.json`);
}

export function getSessionLevel(key: string): AssistanceLevel | null {
  return sessions.get(key)?.level ?? null;
}

export function setLevel(key: string, level: AssistanceLevel): void {
  const s = sessions.get(key);
  if (s && s.level !== level) {
    s.level = level;
    s.levelChanged = true;
  }
}

export async function resetSession(deps: TutorDeps, key: string): Promise<void> {
  const s = sessions.get(key);
  if (s) {
    s.queue.close();
    sessions.delete(key);
  }
  await writeJson(sessionFile(deps.dataDir, key), { sessionId: null });
}

export function updateContext(key: string, files: Record<string, string>, lastRun: RunResult | null): void {
  const s = sessions.get(key);
  if (s) {
    s.latestFiles = files;
    if (lastRun) s.lastRun = lastRun;
  }
}

// ---------- per-session tools ----------

function buildTools(deps: TutorDeps, session: TutorSession) {
  const { dataDir } = deps;
  const lesson = session.lesson;
  const key = session.key;

  const runCode = tool(
    "run_code",
    "Run the learner's current editor code and return the result.",
    {},
    async () => {
      hub.send(key, { type: "tool-use", name: "run_code" });
      let result: RunResult;
      if (lesson.language === "html-css") {
        const assertions = lesson.checks.flatMap((c) => (c.type === "dom" ? c.assertions : []));
        const { domSnapshot } = evaluateDomAssertions(session.latestFiles, assertions);
        result = { ok: true, exitCode: 0, stdout: "", stderr: "", durationMs: 0, timedOut: false, domSnapshot };
      } else {
        result = await runLocal(dataDir, {
          language: lesson.language,
          entry: lesson.files[0].path,
          files: session.latestFiles,
          timeoutMs: lesson.timeoutMs,
        });
      }
      session.lastRun = result;
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              exitCode: result.exitCode,
              timedOut: result.timedOut,
              stdout: result.stdout.slice(0, 2000),
              stderr: result.stderr.slice(0, 2000),
              domSnapshot: result.domSnapshot?.slice(0, 3000),
            }),
          },
        ],
      };
    },
  );

  const checkGoal = tool(
    "check_goal",
    "Run every goal check for this lesson against the learner's current code.",
    {},
    async () => {
      hub.send(key, { type: "tool-use", name: "check_goal" });
      const pass = await runCheckPass(dataDir, lesson, session.latestFiles, lesson.testFiles);
      const allPassed = pass.checks.every((c) => c.passed);
      hub.send(key, { type: "check-results", checks: pass.checks, completed: false });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ allPassed, checks: pass.checks.map((c) => ({ id: c.checkId, passed: c.passed, message: c.message })) }),
          },
        ],
      };
    },
  );

  const markComplete = tool(
    "mark_complete",
    "Mark the lesson complete. Refused unless every goal check passes right now. Include a 2-line journal summary of what the learner learned.",
    { journalSummary: z.string().min(10).max(400) },
    async (args) => {
      hub.send(key, { type: "tool-use", name: "mark_complete" });
      // Guard: the server re-runs checks itself; the model can't be sweet-talked.
      const pass = await runCheckPass(dataDir, lesson, session.latestFiles, lesson.testFiles);
      const allPassed = pass.checks.every((c) => c.passed);
      if (!allPassed) {
        const failing = pass.checks.filter((c) => !c.passed).map((c) => c.checkId);
        return {
          content: [{ type: "text" as const, text: `REFUSED: these checks are not passing: ${failing.join(", ")}. Help the learner fix them first.` }],
          isError: true,
        };
      }
      await completeLesson(dataDir, key);
      await appendJournal(dataDir, {
        lessonId: key,
        trackId: lesson.trackId,
        completedAt: new Date().toISOString(),
        summary: args.journalSummary,
      });
      hub.send(key, { type: "check-results", checks: pass.checks, completed: true });
      hub.send(key, { type: "complete" });
      return { content: [{ type: "text" as const, text: "Lesson marked complete. Congratulate the learner briefly." }] };
    },
  );

  const showHint = tool(
    "show_hint",
    "Reveal one of the lesson's baked hints in the lesson pane (0-based index).",
    { index: z.number().int().min(0) },
    async (args) => {
      const max = (lesson.hints?.length ?? 0) - 1;
      if (args.index > max) {
        return { content: [{ type: "text" as const, text: `No hint at index ${args.index}; the last is ${max}.` }], isError: true };
      }
      hub.send(key, { type: "hint", index: args.index });
      return { content: [{ type: "text" as const, text: `Hint ${args.index} is now visible in the lesson pane.` }] };
    },
  );

  const showDoc = tool(
    "show_doc",
    "Open a documentation page in the app's docs drawer.",
    { slug: z.string() },
    async (args) => {
      hub.send(key, { type: "doc", slug: args.slug });
      return { content: [{ type: "text" as const, text: `Doc "${args.slug}" is now open for the learner.` }] };
    },
  );

  const updateProfile = tool(
    "update_profile",
    "Record a durable observation about the learner (recurring mistake, preference, mastered concept). Optionally replace an outdated note by passing a distinctive substring of it.",
    { note: z.string().min(5).max(200), replaces: z.string().optional() },
    async (args) => {
      await appendProfileNote(dataDir, args.note, args.replaces);
      return { content: [{ type: "text" as const, text: "Noted." }] };
    },
  );

  const recommendStart = tool(
    "recommend_start",
    "Deliver the placement recommendation: which unit the learner should start at and their initial assistance level.",
    {
      unitId: z.string(),
      assistanceLevel: z.number().int().min(1).max(5),
      reasoning: z.string().max(300),
    },
    async (args) => {
      hub.send(key, { type: "recommendation", unitId: args.unitId, assistanceLevel: args.assistanceLevel, reasoning: args.reasoning });
      return { content: [{ type: "text" as const, text: "Recommendation delivered — now tell the learner in one or two warm sentences." }] };
    },
  );

  const toolsByMode = {
    lesson: [runCode, checkGoal, markComplete, showHint, showDoc, updateProfile],
    playground: [runCode, showDoc, updateProfile],
    placement: [recommendStart, updateProfile],
  }[session.mode];

  return createSdkMcpServer({
    name: "tutor",
    version: "1.0.0",
    tools: toolsByMode,
  });
}

const TOOL_NAMES = [
  "mcp__tutor__run_code",
  "mcp__tutor__check_goal",
  "mcp__tutor__mark_complete",
  "mcp__tutor__show_hint",
  "mcp__tutor__show_doc",
  "mcp__tutor__update_profile",
  "mcp__tutor__recommend_start",
];

// ---------- the session loop ----------

async function startSession(deps: TutorDeps, session: TutorSession): Promise<void> {
  const { dataDir } = deps;
  const key = session.key;
  const settings = await deps.getSettings().catch(() => DEFAULT_SETTINGS);
  const solution = await deps.getSolution(key);
  const profile = await getProfile(dataDir);
  const docSlugs = await deps.getDocSlugs();
  const stored = await readJson<{ sessionId?: string | null }>(sessionFile(dataDir, key), {});

  const systemPrompt =
    session.mode === "playground"
      ? buildPlaygroundPrompt({ language: session.lesson.language, profile, docSlugs, level: session.level })
      : session.mode === "placement"
        ? buildPlacementPrompt({
            trackTitle: session.placementInfo?.trackTitle ?? session.lesson.trackId,
            units: session.placementInfo?.units ?? [],
            profile,
          })
        : buildSystemPrompt({
            lesson: session.lesson,
            solution,
            level: session.level,
            profile,
            docSlugs,
          });

  async function* turns() {
    while (true) {
      const item = await session.queue.next();
      if (!item) return;
      yield {
        type: "user" as const,
        message: { role: "user" as const, content: item.wrapped },
        parent_tool_use_id: null,
        session_id: "",
      };
    }
  }

  try {
    const q = query({
      prompt: turns(),
      options: {
        model: settings.tutorModel,
        systemPrompt,
        mcpServers: { tutor: buildTools(deps, session) },
        allowedTools: TOOL_NAMES,
        disallowedTools: ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch", "WebSearch", "Task", "TodoWrite", "NotebookEdit"],
        includePartialMessages: true,
        resume: stored.sessionId ?? undefined,
        env: sdkEnv(),
        maxTurns: 100,
      },
    });

    for await (const message of q) {
      if (message.type === "system" && message.subtype === "init") {
        await writeJson(sessionFile(dataDir, key), { sessionId: message.session_id, updatedAt: new Date().toISOString() });
      } else if (message.type === "stream_event") {
        const event = message.event as { type: string; delta?: { type: string; text?: string }; content_block?: { type: string; name?: string } };
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
          hub.send(key, { type: "text-delta", text: event.delta.text });
        }
      } else if (message.type === "result") {
        hub.send(key, { type: "turn-end" });
        if (message.subtype !== "success") {
          hub.send(key, { type: "error", message: `Tutor error: ${message.subtype}` });
        }
      }
    }
  } catch (err) {
    console.error(`[tutor] session ${key} failed:`, err);
    hub.send(key, { type: "error", message: String(err) });
  } finally {
    sessions.delete(key);
  }
}

export async function sendMessage(
  deps: TutorDeps,
  lesson: Lesson,
  opts: {
    text: string;
    files: Record<string, string>;
    lastRun?: RunResult | null;
    level: AssistanceLevel;
    mode?: SessionMode;
    placementInfo?: PlacementInfo;
  },
): Promise<void> {
  const key = `${lesson.trackId}/${lesson.unitId}/${lesson.id}`;
  let session = sessions.get(key);
  if (!session) {
    session = {
      key,
      lesson,
      mode: opts.mode ?? "lesson",
      placementInfo: opts.placementInfo,
      level: opts.level,
      levelChanged: false,
      latestFiles: opts.files,
      lastRun: opts.lastRun ?? null,
      queue: new AsyncQueue<QueuedTurn>(),
      done: Promise.resolve(),
    };
    sessions.set(key, session);
    session.done = startSession(deps, session);
  }
  session.latestFiles = opts.files;
  if (opts.lastRun) session.lastRun = opts.lastRun;
  if (opts.level !== session.level) setLevel(key, opts.level);

  const wrapped = wrapTurn({
    text: opts.text,
    level: session.level,
    levelChanged: session.levelChanged,
    files: opts.files,
    lastRun: session.lastRun,
  });
  session.levelChanged = false;
  session.queue.push({ wrapped });
}

// ---------- startup auth self-test ----------

export type SdkAuthStatus = "unknown" | "checking" | "ok" | "failed";
let authStatus: SdkAuthStatus = "unknown";
let authDetail = "";

export function getAuthStatus(): { status: SdkAuthStatus; detail: string } {
  return { status: authStatus, detail: authDetail };
}

export async function selfTestAuth(): Promise<void> {
  authStatus = "checking";
  try {
    for await (const message of query({
      prompt: "Reply with exactly: ok",
      options: {
        model: "claude-haiku-4-5-20251001",
        maxTurns: 1,
        allowedTools: [],
        env: sdkEnv(),
      },
    })) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          authStatus = "ok";
          authDetail = "";
        } else {
          authStatus = "failed";
          authDetail = message.subtype;
        }
      }
    }
  } catch (err) {
    authStatus = "failed";
    authDetail = String(err);
  }
  console.log(`[tutor] SDK auth self-test: ${authStatus}${authDetail ? ` (${authDetail})` : ""}`);
}
