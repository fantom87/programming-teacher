import { query } from "@anthropic-ai/claude-agent-sdk";
import type { CheckResult, Lesson, RunResult, Settings } from "@teacher/shared";
import { JUDGE_SYSTEM, judgePrompt } from "./prompts.js";

// One-shot ai-judge query: no tools, single turn, strict JSON verdict.
// Fails closed ("couldn't grade") rather than passing on parse failure.

export function sdkEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined && k !== "ANTHROPIC_API_KEY") env[k] = v; // never bill a stray API key
  }
  return env;
}

async function oneShot(prompt: string, systemPrompt: string, model: string): Promise<string | null> {
  try {
    for await (const message of query({
      prompt,
      options: {
        model,
        systemPrompt,
        maxTurns: 1,
        allowedTools: [],
        disallowedTools: ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch", "WebSearch", "Task", "TodoWrite", "NotebookEdit"],
        env: sdkEnv(),
      },
    })) {
      if (message.type === "result") {
        return message.subtype === "success" ? message.result : null;
      }
    }
  } catch (err) {
    console.error("[judge] query failed:", err);
  }
  return null;
}

function parseVerdict(text: string): { passed: boolean; message: string } | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const v = JSON.parse(match[0]) as { passed?: unknown; message?: unknown };
    if (typeof v.passed === "boolean") {
      return { passed: v.passed, message: typeof v.message === "string" ? v.message : "" };
    }
  } catch {
    // fall through
  }
  return null;
}

export async function judgeCheck(
  getModel: () => Promise<Settings["tutorModel"]>,
  lesson: Lesson,
  rubric: string,
  files: Record<string, string>,
  run: RunResult | null,
): Promise<CheckResult> {
  const model = await getModel();
  const prompt = judgePrompt(lesson, rubric, files, run);

  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await oneShot(prompt, JUDGE_SYSTEM, model);
    if (text) {
      const verdict = parseVerdict(text);
      if (verdict) {
        return { checkId: "", passed: verdict.passed, message: verdict.message || (verdict.passed ? "Approved." : "Not quite there yet.") };
      }
    }
  }
  return { checkId: "", passed: false, message: "The tutor couldn't grade this just now — try checking again." };
}
