import type { RuntimeStatus } from "./preflight.js";

// One place for "that runtime is missing — here's how to install it". The app
// runs on Windows and on Linux (a cloud container), so every hint has to name
// a command the learner can actually paste on THEIR machine: winget on
// Windows, apt/curl/rustup on Linux. Keep both branches saying the same thing
// about the same runtime — only the install command differs.

interface Hint {
  /** which RuntimeStatus field decides whether this language can run */
  runtime: keyof RuntimeStatus;
  win32: string;
  posix: string;
}

const HINTS: Record<string, Hint> = {
  python: {
    runtime: "python",
    win32: "Python isn't installed (or not on PATH). Install it with: winget install Python.Python.3.12",
    posix:
      "Python isn't installed (or not on PATH). Install it with: sudo apt install python3 (python3 is what the runner looks for first).",
  },
  javascript: {
    runtime: "node",
    win32: "Node.js isn't installed (or not on PATH). Install it with: winget install OpenJS.NodeJS.LTS",
    posix: "Node.js isn't installed (or not on PATH). Install it from https://nodejs.org or with: sudo apt install nodejs",
  },
  csharp: {
    runtime: "dotnet",
    win32: "The .NET SDK isn't installed. Install it with: winget install Microsoft.DotNet.SDK.8",
    posix:
      "The .NET SDK isn't installed. Install it with: sudo apt install dotnet-sdk-8.0 — or run the script at https://dot.net/v1/dotnet-install.sh, which puts it in ~/.dotnet.",
  },
  go: {
    runtime: "go",
    win32:
      "Go isn't installed. Download the Windows zip from https://go.dev/dl and extract it to %LOCALAPPDATA%\\Programs\\go (so go.exe ends up in %LOCALAPPDATA%\\Programs\\go\\bin).",
    posix:
      "Go isn't installed. Install it with: sudo apt install golang-go — or download the Linux tarball from https://go.dev/dl and extract it to /usr/local (so go ends up at /usr/local/go/bin/go).",
  },
  rust: {
    runtime: "rust",
    win32: "Rust isn't installed. Install it from https://rustup.rs (the default options are fine).",
    posix:
      "Rust isn't installed. Install it with: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh (see https://rustup.rs) — it lands in ~/.cargo/bin.",
  },
  bash: {
    runtime: "bash",
    win32: "Bash couldn't be found. It comes with Git for Windows — install it with: winget install Git.Git",
    posix: "Bash couldn't be found on PATH. Install it with: sudo apt install bash",
  },
  powershell: {
    runtime: "powershell",
    win32: "PowerShell couldn't be found — Windows PowerShell (powershell.exe) should be on PATH.",
    posix:
      "PowerShell 7 (pwsh) isn't installed. It's optional on Linux — install it from https://aka.ms/powershell if you want to run PowerShell lessons.",
  },
};

/** The install hint for a language, written for the given platform. Null for
 *  languages with no external runtime (sql runs in-process, html-css in jsdom). */
export function runtimeHint(language: string, platform: NodeJS.Platform = process.platform): string | null {
  const hint = HINTS[language];
  if (!hint) return null;
  return platform === "win32" ? hint.win32 : hint.posix;
}

/** Platform-appropriate "install this first" message, or null when the
 *  language's runtime is present (or needs none). */
export function missingRuntimeHint(
  language: string,
  runtimes: RuntimeStatus,
  platform: NodeJS.Platform = process.platform,
): string | null {
  const hint = HINTS[language];
  if (!hint || runtimes[hint.runtime]) return null;
  return platform === "win32" ? hint.win32 : hint.posix;
}

/** Languages this module knows how to preflight — exported for tests. */
export const hintedLanguages: readonly string[] = Object.keys(HINTS);
