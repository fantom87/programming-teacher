import { describe, expect, it } from "vitest";
import path from "node:path";
import os from "node:os";
import {
  bashCandidates,
  dotnetCandidates,
  goCandidates,
  powershellArgs,
  powershellCandidates,
  pythonCandidates,
  resolveBinary,
  rustBinaryName,
  rustcCandidates,
  workspaceFile,
} from "./localRunner.js";
import { hintedLanguages, missingRuntimeHint, runtimeHint } from "../runtimeHints.js";
import type { RuntimeStatus } from "../preflight.js";

// The app runs on Windows (desktop shell) and on Linux (cloud container), and
// only one of those is under the test runner at a time — so every function
// that branches on the OS takes the platform as an argument and both branches
// are asserted here, whichever machine this suite happens to run on.

const POSIX_PLATFORMS: NodeJS.Platform[] = ["linux", "darwin"];
const WINDOWSISM = /\.exe$|^[A-Za-z]:\\|\\\\|%[A-Za-z_]+%|winget/;

const ALL_RUNTIMES: RuntimeStatus = {
  python: "Python 3.12.0",
  node: "v22.0.0",
  dotnet: "8.0.100",
  go: "go version go1.22",
  rust: "rustc 1.79.0",
  powershell: "PowerShell 7.4.0",
  bash: "GNU bash, version 5.2",
  sql: "sql.js (bundled)",
};

describe("binary candidates per platform", () => {
  it("resolves Go from PATH first, then the platform's install location", () => {
    expect(goCandidates("win32")[0]).toBe("go");
    expect(goCandidates("win32")[1]).toMatch(/Programs\\go\\bin\\go\.exe$/);
    expect(goCandidates("linux")).toEqual(["go", "/usr/local/go/bin/go"]);
  });

  it("resolves rustc from PATH first, then the cargo bin dir", () => {
    expect(rustcCandidates("win32")[1]).toMatch(/\\\.cargo\\bin\\rustc\.exe$/);
    expect(rustcCandidates("linux")[0]).toBe("rustc");
    expect(rustcCandidates("linux")[1]).toMatch(/\/\.cargo\/bin\/rustc$/);
  });

  it("resolves dotnet from PATH first, then the per-user install dir", () => {
    expect(dotnetCandidates("win32")[1]).toMatch(/dotnet\\dotnet\.exe$/);
    expect(dotnetCandidates("linux")[0]).toBe("dotnet");
    expect(dotnetCandidates("linux")[1]).toMatch(/\/\.dotnet\/dotnet$/);
    expect(dotnetCandidates("linux")).toContain("/usr/share/dotnet/dotnet");
  });

  it("prefers Git Bash on Windows and PATH bash everywhere else", () => {
    // Bare `bash` on Windows is usually the WSL shim, which can't run a
    // workspace script — Git Bash has to win there.
    expect(bashCandidates("win32")[0]).toMatch(/Git\\bin\\bash\.exe$/);
    expect(bashCandidates("win32")).toContain("bash");
    expect(bashCandidates("linux")[0]).toBe("bash");
    expect(bashCandidates("linux").some((c) => /git/i.test(c))).toBe(false);
  });

  it("probes powershell.exe on Windows and pwsh elsewhere", () => {
    expect(powershellCandidates("win32")).toEqual(["powershell.exe"]);
    expect(powershellCandidates("linux")[0]).toBe("pwsh");
    expect(powershellCandidates("linux").some((c) => c.includes("powershell.exe"))).toBe(false);
  });

  it("prefers python3 on POSIX (Ubuntu often has no bare `python`)", () => {
    expect(pythonCandidates("win32")).toEqual(["python"]);
    expect(pythonCandidates("linux")).toEqual(["python3", "python"]);
  });

  it("never leaks Windows-only paths into a POSIX candidate list", () => {
    for (const platform of POSIX_PLATFORMS) {
      const lists = [
        goCandidates(platform),
        rustcCandidates(platform),
        dotnetCandidates(platform),
        bashCandidates(platform),
        powershellCandidates(platform),
        pythonCandidates(platform),
      ];
      for (const candidate of lists.flat()) {
        expect(candidate).not.toMatch(WINDOWSISM);
        expect(candidate.includes("\\")).toBe(false);
      }
    }
  });

  it("keeps every absolute Windows candidate an .exe", () => {
    const lists = [
      goCandidates("win32"),
      rustcCandidates("win32"),
      dotnetCandidates("win32"),
      bashCandidates("win32"),
    ];
    for (const candidate of lists.flat().filter((c) => path.win32.isAbsolute(c))) {
      expect(candidate.endsWith(".exe")).toBe(true);
    }
  });

  it("passes -ExecutionPolicy only on Windows (pwsh rejects it)", () => {
    expect(powershellArgs("script.ps1", "win32")).toEqual([
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      "script.ps1",
    ]);
    expect(powershellArgs("script.ps1", "linux")).toEqual(["-NoProfile", "-File", "script.ps1"]);
  });

  it("compiles rust to main.exe on Windows and main elsewhere", () => {
    expect(rustBinaryName("win32")).toBe("main.exe");
    expect(rustBinaryName("linux")).toBe("main");
  });
});

describe("resolveBinary (this platform)", () => {
  it("finds a bare name that is really on PATH", async () => {
    // node is on PATH by definition — this suite is running under it.
    expect(await resolveBinary(["node"])).toBe("node");
  });

  it("accepts an absolute candidate that exists", async () => {
    expect(await resolveBinary(["definitely-not-installed-xyzzy", process.execPath])).toBe(process.execPath);
  });

  it("falls back to the first bare name so the spawn fails with a real ENOENT", async () => {
    const missing = await resolveBinary(["definitely-not-installed-xyzzy", path.join(os.tmpdir(), "nope-xyzzy")]);
    expect(missing).toBe("definitely-not-installed-xyzzy");
  });
});

describe("install hints per platform", () => {
  it("gives winget commands on Windows and apt/curl ones on Linux", () => {
    expect(runtimeHint("python", "win32")).toContain("winget");
    expect(runtimeHint("python", "linux")).toContain("python3");
    expect(runtimeHint("rust", "linux")).toContain("rustup.rs");
    expect(runtimeHint("go", "win32")).toContain("%LOCALAPPDATA%");
    expect(runtimeHint("go", "linux")).toContain("/usr/local");
  });

  it("says PowerShell 7 is optional on Linux", () => {
    const hint = runtimeHint("powershell", "linux") ?? "";
    expect(hint).toContain("optional");
    expect(hint).toContain("https://aka.ms/powershell");
  });

  it("never tells a Linux user to run winget (or names a Windows path)", () => {
    for (const language of hintedLanguages) {
      for (const platform of POSIX_PLATFORMS) {
        expect(runtimeHint(language, platform)).not.toMatch(WINDOWSISM);
      }
    }
  });

  it("has a hint for every language on both platforms", () => {
    for (const language of hintedLanguages) {
      expect(runtimeHint(language, "win32")?.length).toBeGreaterThan(20);
      expect(runtimeHint(language, "linux")?.length).toBeGreaterThan(20);
    }
  });

  it("has no hint for languages that need no external runtime", () => {
    expect(runtimeHint("sql", "linux")).toBeNull();
    expect(runtimeHint("html-css", "win32")).toBeNull();
  });

  it("stays quiet when the runtime is actually installed", () => {
    for (const language of hintedLanguages) {
      expect(missingRuntimeHint(language, ALL_RUNTIMES, "linux")).toBeNull();
    }
  });

  it("reports the missing runtime with the right platform's instructions", () => {
    const noPwsh: RuntimeStatus = { ...ALL_RUNTIMES, powershell: null };
    expect(missingRuntimeHint("powershell", noPwsh, "linux")).toContain("aka.ms/powershell");
    const noGo: RuntimeStatus = { ...ALL_RUNTIMES, go: null };
    expect(missingRuntimeHint("go", noGo, "win32")).toContain("go.dev/dl");
    expect(missingRuntimeHint("go", noGo, "linux")).toContain("golang-go");
    // javascript maps to the node field, not a "javascript" runtime.
    const noNode: RuntimeStatus = { ...ALL_RUNTIMES, node: null };
    expect(missingRuntimeHint("javascript", noNode, "linux")).toContain("Node.js");
  });
});

describe("workspaceFile", () => {
  const dir = path.resolve(os.tmpdir(), "teacher-workspace-guard");

  it("accepts plain and nested lesson paths", () => {
    expect(workspaceFile(dir, "main.py")).toBe(path.join(dir, "main.py"));
    expect(workspaceFile(dir, "tests/test_main.py")).toBe(path.join(dir, "tests", "test_main.py"));
  });

  it("rejects escapes the same way on every platform", () => {
    // Backslash is a separator on Windows but a legal filename character on
    // Linux: rejecting it outright keeps the rule identical on both.
    for (const bad of ["..\\..\\evil.py", "../evil.py", "a/../../evil.py", "", ".", "sub\\file.py"]) {
      expect(() => workspaceFile(dir, bad)).toThrow(/illegal file path/);
    }
  });

  it("rejects an absolute path", () => {
    expect(() => workspaceFile(dir, path.posix.join("/etc", "passwd"))).toThrow(/illegal file path/);
    expect(() => workspaceFile(dir, "C:\\Windows\\System32\\evil.dll")).toThrow(/illegal file path/);
  });
});
