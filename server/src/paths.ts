import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Every on-disk location the server touches resolves here, once. Two very
// different layouts have to work:
//
//   repo      — sources under server/src, content/ and docs-content/ beside
//               them, the frontend built into web/dist, state in data/.
//   packaged  — a single bundled server.cjs inside an Electron app, with
//               content/docs/web-dist shipped as READ-ONLY resources and the
//               learner's state in the OS user-data dir. Nothing is where the
//               repo layout would put it, so the launcher passes explicit
//               paths through PT_* env vars.
//
// With no env vars set the result is byte-identical to the repo-relative
// resolution this file replaced, so dev and the current desktop shell are
// untouched.

export interface Paths {
  /** Repo root — only meaningful in a repo layout (rebuild source scan). */
  root: string;
  /** Lesson tracks. Written to when a custom lesson is accepted. */
  contentDir: string;
  /** Reference docs library (read-only). */
  docsDir: string;
  /** Built frontend served in --prod. */
  webDist: string;
  /** Learner state: progress, drafts, snapshots, run workspaces. Writable. */
  dataDir: string;
  /**
   * Skip the "is web/dist stale?" rebuild entirely. A packaged app has no
   * vite, no frontend sources, and a read-only resource dir — the check can
   * only waste time or throw.
   */
  noRebuild: boolean;
}

const __dirname_ = path.dirname(fileURLToPath(import.meta.url));

/** Env var, trimmed and made absolute; undefined when unset or blank. */
function fromEnv(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  return raw ? path.resolve(raw) : undefined;
}

/**
 * Walk up from this module looking for the repo root. `server/src/paths.ts`
 * is two levels down; a bundled `build/server.cjs` is one. Finding the marker
 * makes both correct without either hard-coding its own depth.
 */
function findRepoRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, "content", "tracks.json")) && fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir, "..", ".."); // historical default: server/src → repo root
}

let cached: Paths | null = null;

export function resolvePaths(): Paths {
  if (cached) return cached;
  const root = findRepoRoot(__dirname_);
  cached = {
    root,
    contentDir: fromEnv("PT_CONTENT_DIR") ?? path.join(root, "content"),
    docsDir: fromEnv("PT_DOCS_DIR") ?? path.join(root, "docs-content"),
    webDist: fromEnv("PT_WEB_DIST") ?? path.join(root, "web", "dist"),
    dataDir: fromEnv("PT_DATA_DIR") ?? path.join(root, "data"),
    noRebuild: process.env.PT_NO_REBUILD === "1",
  };
  return cached;
}
