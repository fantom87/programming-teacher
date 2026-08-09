import { spawn, execFile } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { Language, RunResult } from "@teacher/shared";
import { extractTestEvents } from "@teacher/shared";

// Raw capture is generous so late __TEST__ events survive a chatty program;
// the learner-visible output is trimmed to OUTPUT_CAP after event extraction.
const RAW_CAP = 256 * 1024;
const OUTPUT_CAP = 64 * 1024;

function killTree(pid: number): void {
  // child.kill() does not kill process trees on Windows, and dotnet/python
  // spawn children — taskkill /T /F is the reliable way.
  execFile("taskkill", ["/pid", String(pid), "/T", "/F"], () => {});
}

/** Trim display output to OUTPUT_CAP, never splitting a surrogate pair. */
function truncateOutput(s: string): string {
  if (s.length <= OUTPUT_CAP) return s;
  let end = OUTPUT_CAP;
  const last = s.charCodeAt(end - 1);
  if (last >= 0xd800 && last <= 0xdbff) end -= 1; // lone high surrogate: cut before it
  return `${s.slice(0, end)}\n…output truncated`;
}

interface SpawnSpec {
  command: string;
  args: string[];
  cwd: string;
  env?: Record<string, string>;
  stdin?: string;
  timeoutMs: number;
  /** per-run test-harness nonce — only matching __TEST__ lines become events */
  nonce?: string;
}

export function spawnCapture(spec: SpawnSpec): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    // Stateful decoding: a multibyte character split across pipe chunks must
    // not become U+FFFD mojibake (which would fail exact stdout matches).
    const outDecoder = new StringDecoder("utf8");
    const errDecoder = new StringDecoder("utf8");

    // Lesson programs must produce plain output: the dev environment sets
    // FORCE_COLOR (concurrently), which would make Node colorize console.log
    // with ANSI codes and break output checks.
    const env: Record<string, string | undefined> = { ...process.env, ...spec.env, NO_COLOR: "1" };
    delete env.FORCE_COLOR;

    const child = spawn(spec.command, spec.args, {
      cwd: spec.cwd,
      env,
      shell: false,
      windowsHide: true,
    });

    let forceTimer: NodeJS.Timeout | undefined;
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid) killTree(child.pid);
      // If taskkill can't fell the tree (wedged/AV-locked process), 'close'
      // may never fire — force-finish so the request can't hang forever.
      forceTimer = setTimeout(() => finish(null), 5_000);
      forceTimer.unref();
    }, spec.timeoutMs);

    child.stdout.on("data", (d: Buffer) => {
      if (stdout.length < RAW_CAP) stdout += outDecoder.write(d);
    });
    child.stderr.on("data", (d: Buffer) => {
      if (stderr.length < RAW_CAP) stderr += errDecoder.write(d);
    });

    const finish = (exitCode: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (forceTimer) clearTimeout(forceTimer);
      // Extract events from the full raw capture BEFORE trimming, so debug
      // spam can't push the harness's test results past the display cap.
      const [clean, events] = extractTestEvents(stdout + outDecoder.end(), spec.nonce);
      const errText = truncateOutput(stderr + errDecoder.end());
      resolve({
        ok: exitCode === 0 && !timedOut,
        exitCode,
        stdout: truncateOutput(clean),
        stderr:
          errText +
          (timedOut ? (errText ? "\n" : "") + `Timed out after ${spec.timeoutMs / 1000}s (infinite loop?)` : ""),
        durationMs: Date.now() - start,
        timedOut,
        events: events.length > 0 ? events : undefined,
      });
    };

    child.on("error", (err) => {
      stderr += String(err);
      finish(null);
    });
    child.on("close", (code) => finish(code));

    // A child that exits before draining stdin fails the write with EPIPE;
    // without a listener that 'error' event would crash the whole server.
    child.stdin.on("error", () => {});
    if (spec.stdin !== undefined) child.stdin.write(spec.stdin);
    child.stdin.end();
  });
}

// Reuse one parent dir for workspaces so Windows Defender warms up on it.
export async function makeWorkspace(dataDir: string, files: Record<string, string>): Promise<string> {
  const dir = path.join(dataDir, "run-workspaces", crypto.randomUUID());
  await fs.mkdir(dir, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    const full = path.join(dir, name);
    // Refuse path escapes from content/tutor-provided filenames.
    if (!full.startsWith(dir)) throw new Error(`illegal file path: ${name}`);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, contents, "utf8");
  }
  return dir;
}

export async function cleanupWorkspace(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
}

/**
 * Delete run-workspace dirs left behind when cleanup failed (Defender or a
 * just-killed child holding a lock). Best effort; called at server start.
 */
export async function sweepStaleWorkspaces(dataDir: string, maxAgeMs = 60 * 60 * 1000): Promise<void> {
  const root = path.join(dataDir, "run-workspaces");
  let entries: string[];
  try {
    entries = await fs.readdir(root);
  } catch {
    return; // nothing ever ran
  }
  const cutoff = Date.now() - maxAgeMs;
  for (const name of entries) {
    const full = path.join(root, name);
    try {
      const st = await fs.stat(full);
      if (st.mtimeMs < cutoff) await fs.rm(full, { recursive: true, force: true });
    } catch {
      // still locked or already gone — the next sweep gets it
    }
  }
}

export interface LocalRunOptions {
  language: Language;
  entry: string;
  files: Record<string, string>;
  stdin?: string;
  timeoutMs?: number;
  /** lesson key — C# runs reuse a persistent per-lesson workspace keyed on it */
  lessonKey?: string;
  /** per-run test-harness nonce (see extractTestEvents) */
  nonce?: string;
}

export async function runLocal(dataDir: string, opts: LocalRunOptions): Promise<RunResult> {
  const timeoutMs = opts.timeoutMs ?? 10_000;
  if (opts.language === "csharp") return runCsharp(dataDir, opts, timeoutMs);
  const dir = await makeWorkspace(dataDir, opts.files);
  try {
    switch (opts.language) {
      case "python":
        return await spawnCapture({
          command: "python",
          args: ["-X", "utf8", opts.entry],
          cwd: dir,
          env: { PYTHONIOENCODING: "utf-8" },
          stdin: opts.stdin,
          timeoutMs,
          nonce: opts.nonce,
        });
      case "javascript":
        return await spawnCapture({
          command: "node",
          args: opts.entry.endsWith(".ts") ? ["--experimental-strip-types", opts.entry] : [opts.entry],
          cwd: dir,
          stdin: opts.stdin,
          timeoutMs,
          nonce: opts.nonce,
        });
      case "html-css":
        throw new Error("html-css lessons never use the local runner");
    }
  } finally {
    await cleanupWorkspace(dir);
  }
}

// C#: `dotnet run` in a persistent per-lesson workspace under
// data/cs-workspaces — bin/obj survive between runs, so only the first run
// pays the full restore+compile; later runs reuse the incremental build.
const CSPROJ = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
`;

async function csWorkspace(dataDir: string, opts: LocalRunOptions): Promise<string> {
  const wsKey = opts.lessonKey ?? `adhoc/${opts.entry}`;
  const dir = path.join(dataDir, "cs-workspaces", crypto.createHash("sha1").update(wsKey).digest("hex"));
  await fs.mkdir(dir, { recursive: true });
  const csproj = path.join(dir, "app.csproj");
  try {
    await fs.access(csproj);
  } catch {
    await fs.writeFile(csproj, CSPROJ, "utf8"); // written once; bin/obj stay warm
  }
  // Drop stray sources from earlier runs — the csproj compiles every .cs in
  // the folder, so a leftover file would silently change the program.
  for (const existing of await fs.readdir(dir)) {
    if (existing.endsWith(".cs") && !(existing in opts.files)) {
      await fs.rm(path.join(dir, existing), { force: true });
    }
  }
  for (const [name, contents] of Object.entries(opts.files)) {
    const full = path.join(dir, name);
    // Refuse path escapes from content/tutor-provided filenames.
    if (!full.startsWith(dir)) throw new Error(`illegal file path: ${name}`);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, contents, "utf8");
  }
  return dir;
}

async function runCsharp(dataDir: string, opts: LocalRunOptions, timeoutMs: number): Promise<RunResult> {
  const dir = await csWorkspace(dataDir, opts);
  return spawnCapture({
    command: "dotnet",
    args: ["run", "--project", ".", "-v", "q", "--nologo"],
    cwd: dir,
    env: {
      DOTNET_CLI_TELEMETRY_OPTOUT: "1",
      DOTNET_NOLOGO: "1",
      // Culture-proof formatting: "9.75" must never become "9,75" on a
      // comma-decimal locale, or every exact stdout check would fail.
      DOTNET_SYSTEM_GLOBALIZATION_INVARIANT: "1",
    },
    stdin: opts.stdin,
    timeoutMs: Math.max(timeoutMs, 60_000), // first build is slow; cap generously
    nonce: opts.nonce,
  });
}
