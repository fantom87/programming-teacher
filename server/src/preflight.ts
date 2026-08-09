import { execFile } from "node:child_process";
import { bashCandidates, goCandidates, resolveBinary, rustcCandidates } from "./runner/localRunner.js";

export interface RuntimeStatus {
  python: string | null;
  node: string | null;
  dotnet: string | null;
  go: string | null;
  rust: string | null;
  powershell: string | null;
  bash: string | null;
  /** in-process sql.js — bundled with the app, never missing */
  sql: string;
}

function version(command: string, args: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    const child = execFile(command, args, { timeout: 10_000, windowsHide: true }, (err, stdout) => {
      resolve(err ? null : stdout.trim().split("\n")[0] || null);
    });
    child.on("error", () => resolve(null));
  });
}

// Cached with a short TTL — not for the process lifetime — so "install it,
// then hit Run again" can actually succeed without restarting the app.
const TTL_MS = 60_000;
let cached: { at: number; status: RuntimeStatus } | null = null;
let probing: Promise<RuntimeStatus> | null = null;

export async function detectRuntimes(force = false): Promise<RuntimeStatus> {
  if (!force && cached && Date.now() - cached.at < TTL_MS) return cached.status;
  probing ??= (async () => {
    try {
      const [python, node, dotnet, go, rust, powershell, bash] = await Promise.all([
        version("python", ["--version"]),
        version("node", ["--version"]),
        version("dotnet", ["--version"]),
        // Go/Rust/bash may live off-PATH (user-scope installs, WSL's bash
        // shim) — probe through the same resolver the runner spawns with.
        resolveBinary(goCandidates()).then((bin) => version(bin, ["version"])),
        resolveBinary(rustcCandidates()).then((bin) => version(bin, ["--version"])),
        version("powershell.exe", ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"]).then((v) =>
          v ? `PowerShell ${v}` : null,
        ),
        resolveBinary(bashCandidates()).then((bin) => version(bin, ["--version"])),
      ]);
      cached = {
        at: Date.now(),
        status: { python, node, dotnet, go, rust, powershell, bash, sql: "sql.js (bundled)" },
      };
      return cached.status;
    } finally {
      probing = null;
    }
  })();
  return probing;
}
