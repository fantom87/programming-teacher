import { spawn, execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { Language, RunResult } from "@teacher/shared";
import { extractTestEvents } from "@teacher/shared";

const OUTPUT_CAP = 64 * 1024;

function killTree(pid: number): void {
  // child.kill() does not kill process trees on Windows, and dotnet/python
  // spawn children — taskkill /T /F is the reliable way.
  execFile("taskkill", ["/pid", String(pid), "/T", "/F"], () => {});
}

interface SpawnSpec {
  command: string;
  args: string[];
  cwd: string;
  env?: Record<string, string>;
  stdin?: string;
  timeoutMs: number;
}

export function spawnCapture(spec: SpawnSpec): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;

    // Lesson programs must produce plain output: the dev environment sets
    // FORCE_COLOR (concurrently), which would make Node colorize console.log
    // with ANSI codes and break output checks.
    const env = { ...process.env, ...spec.env, NO_COLOR: "1" };
    delete env.FORCE_COLOR;

    const child = spawn(spec.command, spec.args, {
      cwd: spec.cwd,
      env,
      shell: false,
      windowsHide: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid) killTree(child.pid);
    }, spec.timeoutMs);

    child.stdout.on("data", (d: Buffer) => {
      if (stdout.length < OUTPUT_CAP) stdout += d.toString("utf8");
    });
    child.stderr.on("data", (d: Buffer) => {
      if (stderr.length < OUTPUT_CAP) stderr += d.toString("utf8");
    });

    const finish = (exitCode: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const [clean, events] = extractTestEvents(stdout.slice(0, OUTPUT_CAP));
      resolve({
        ok: exitCode === 0 && !timedOut,
        exitCode,
        stdout: clean,
        stderr:
          stderr.slice(0, OUTPUT_CAP) +
          (timedOut ? (stderr ? "\n" : "") + `Timed out after ${spec.timeoutMs / 1000}s (infinite loop?)` : ""),
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

export interface LocalRunOptions {
  language: Language;
  entry: string;
  files: Record<string, string>;
  stdin?: string;
  timeoutMs?: number;
}

export async function runLocal(dataDir: string, opts: LocalRunOptions): Promise<RunResult> {
  const timeoutMs = opts.timeoutMs ?? 10_000;
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
        });
      case "javascript":
        return await spawnCapture({
          command: "node",
          args: opts.entry.endsWith(".ts") ? ["--experimental-strip-types", opts.entry] : [opts.entry],
          cwd: dir,
          stdin: opts.stdin,
          timeoutMs,
        });
      case "csharp":
        return await runCsharp(dir, opts, timeoutMs);
      case "html-css":
        throw new Error("html-css lessons never use the local runner");
    }
  } finally {
    await cleanupWorkspace(dir);
  }
}

// C#: `dotnet run` on a minimal console project. The csproj is written into
// the workspace; dotnet's build cache under data/ keeps warm-ish rebuilds
// tolerable. (Per-lesson persistent scaffolds are a later optimization.)
const CSPROJ = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
`;

async function runCsharp(dir: string, opts: LocalRunOptions, timeoutMs: number): Promise<RunResult> {
  await fs.writeFile(path.join(dir, "app.csproj"), CSPROJ, "utf8");
  return spawnCapture({
    command: "dotnet",
    args: ["run", "--project", ".", "-v", "q", "--nologo"],
    cwd: dir,
    env: { DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" },
    stdin: opts.stdin,
    timeoutMs: Math.max(timeoutMs, 60_000), // first build is slow; cap generously
  });
}
