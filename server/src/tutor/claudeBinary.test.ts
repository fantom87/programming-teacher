import { describe, expect, it, afterEach, beforeEach } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  clearClaudeCache,
  installCandidates,
  npmGlobalPrefix,
  resolveClaudeExecutable,
  setClaudePathProvider,
} from "./claudeBinary.js";

// The app ships no Claude Code of its own, so finding the user's install is
// load-bearing: get it wrong and the tutor is silently dead. Both OS branches
// are asserted from whichever machine runs this suite.

const WINDOWSISM = /\.exe$|\.cmd$|^[A-Za-z]:\\|\\/;

describe("installCandidates", () => {
  it("looks in the Windows install locations, and only those", () => {
    const list = installCandidates("win32", { LOCALAPPDATA: "C:\\lad", APPDATA: "C:\\ad" }, "C:\\home", "C:\\npm");
    expect(list.every((c) => WINDOWSISM.test(c))).toBe(true);
    expect(list).toContain("C:\\home\\.local\\bin\\claude.exe");
    expect(list).toContain("C:\\lad\\Programs\\claude\\claude.exe");
    expect(list).toContain("C:\\ad\\npm\\claude.cmd");
    expect(list).toContain("C:\\npm\\claude.cmd");
    // The npm prefix is often nowhere near PATH — the package's own binary
    // has to be reachable under it too.
    expect(list.some((c) => c.startsWith("C:\\npm\\node_modules\\@anthropic-ai\\claude-code"))).toBe(true);
  });

  it("looks in the POSIX install locations, with no Windows paths", () => {
    for (const platform of ["linux", "darwin"] as const) {
      const list = installCandidates(platform, {}, "/home/me", "/usr/local");
      expect(list.some((c) => WINDOWSISM.test(c))).toBe(false);
      expect(list).toContain("/home/me/.local/bin/claude");
      expect(list).toContain("/usr/local/bin/claude");
      expect(list).toContain("/home/me/.npm-global/bin/claude");
    }
  });

  it("omits npm-prefix candidates when there is no prefix to use", () => {
    const list = installCandidates("linux", {}, "/home/me", null);
    expect(list.every((c) => c.length > 0)).toBe(true);
    expect(list).not.toContain("/bin/claude");
  });
});

describe("npmGlobalPrefix", () => {
  it("prefers the environment over any file on disk", async () => {
    expect(await npmGlobalPrefix({ npm_config_prefix: "/from/env" }, "/nonexistent")).toBe("/from/env");
    expect(await npmGlobalPrefix({ NPM_CONFIG_PREFIX: "/from/env2" }, "/nonexistent")).toBe("/from/env2");
  });

  it("reads prefix= out of .npmrc, ignoring other keys", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pt-npmrc-"));
    await fs.writeFile(path.join(dir, ".npmrc"), "cache=C:\\\\cache\nprefix=C:\\NodeJS\\npm\nfoo=bar\n");
    expect(await npmGlobalPrefix({}, dir)).toBe("C:\\NodeJS\\npm");
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("returns null when there is no .npmrc at all", async () => {
    expect(await npmGlobalPrefix({}, path.join(os.tmpdir(), "pt-definitely-not-here"))).toBeNull();
  });
});

describe("resolveClaudeExecutable", () => {
  const originalEnv = process.env.PT_CLAUDE_PATH;

  beforeEach(() => {
    clearClaudeCache();
    setClaudePathProvider(async () => undefined);
  });

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.PT_CLAUDE_PATH;
    else process.env.PT_CLAUDE_PATH = originalEnv;
    clearClaudeCache();
    setClaudePathProvider(async () => undefined);
  });

  it("uses PT_CLAUDE_PATH when it points at a real file", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pt-claude-"));
    const fake = path.join(dir, "claude.exe");
    await fs.writeFile(fake, "not really claude");
    process.env.PT_CLAUDE_PATH = fake;
    expect(await resolveClaudeExecutable()).toBe(fake);
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("reports nothing rather than falling back when PT_CLAUDE_PATH is wrong", async () => {
    // An explicit override that misses must not silently run some other
    // Claude Code the user didn't ask for — that is how "not installed" gets
    // misreported as "not signed in".
    process.env.PT_CLAUDE_PATH = path.join(os.tmpdir(), "pt-no-such-claude-binary");
    expect(await resolveClaudeExecutable()).toBeNull();
  });

  it("honours an explicit path from settings", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pt-claude-"));
    const fake = path.join(dir, "claude");
    await fs.writeFile(fake, "not really claude");
    delete process.env.PT_CLAUDE_PATH;
    setClaudePathProvider(async () => fake);
    expect(await resolveClaudeExecutable()).toBe(fake);
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("ignores a blank settings path and never throws when the provider fails", async () => {
    delete process.env.PT_CLAUDE_PATH;
    setClaudePathProvider(async () => "   ");
    await expect(resolveClaudeExecutable()).resolves.not.toThrow();
    clearClaudeCache();
    setClaudePathProvider(async () => {
      throw new Error("settings.json is on fire");
    });
    await expect(resolveClaudeExecutable()).resolves.not.toThrow();
  });

  it("follows a Windows npm shim to the real binary beside it", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pt-claude-shim-"));
    const shim = path.join(dir, "claude.cmd");
    const real = path.join(dir, "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe");
    await fs.mkdir(path.dirname(real), { recursive: true });
    await fs.writeFile(shim, "@ECHO off");
    await fs.writeFile(real, "not really claude");
    process.env.PT_CLAUDE_PATH = shim;
    // Spawning a .cmd without a shell fails outright, and the SDK spawns with
    // shell: false — so the shim must resolve to the binary it wraps.
    expect(await resolveClaudeExecutable()).toBe(real);
    await fs.rm(dir, { recursive: true, force: true });
  });
});
