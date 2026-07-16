import express from "express";
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { curriculumRoutes } from "./routes/curriculum.js";
import { progressRoutes } from "./routes/progress.js";
import { draftRoutes } from "./routes/drafts.js";
import { settingsRoutes } from "./routes/settings.js";
import { runRoutes } from "./routes/run.js";
import { tutorRoutes } from "./routes/tutor.js";
import { docsRoutes } from "./routes/docs.js";
import { getCurriculum } from "./curriculum/loader.js";
import { detectRuntimes } from "./preflight.js";
import { setJudge } from "./checks/run.js";
import { judgeCheck } from "./tutor/judge.js";
import { getAuthStatus, selfTestAuth } from "./tutor/service.js";
import { readJson } from "./store/jsonStore.js";
import { DEFAULT_SETTINGS, type Settings } from "@teacher/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");
export const DATA_DIR = path.join(ROOT, "data");
export const CONTENT_DIR = path.join(ROOT, "content");

const isProd = process.argv.includes("--prod");
const PORT = 4517;

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (_req, res) => {
  const auth = getAuthStatus();
  res.json({
    ok: true,
    version: "0.1.0",
    runtimes: await detectRuntimes(),
    sdkAuth: auth.status,
    sdkAuthDetail: auth.detail,
  });
});

app.use(curriculumRoutes(CONTENT_DIR, DATA_DIR));
app.use(progressRoutes(DATA_DIR));
app.use(draftRoutes(DATA_DIR));
app.use(settingsRoutes(DATA_DIR));
app.use(runRoutes(CONTENT_DIR, DATA_DIR));
app.use(tutorRoutes(CONTENT_DIR, DATA_DIR));
app.use(docsRoutes(path.join(ROOT, "docs-content")));

// The ai-judge check type is powered by the tutor's one-shot grader.
setJudge((lesson, rubric, files, run) =>
  judgeCheck(
    async () => (await readJson<Settings>(path.join(DATA_DIR, "settings.json"), DEFAULT_SETTINGS)).tutorModel,
    lesson,
    rubric,
    files,
    run,
  ),
);

// In prod, never serve a stale frontend: if any source file is newer than the
// built bundle, rebuild before serving. Keeps the desktop app honest after
// code changes — a restart is all it takes.
function newestMtime(dir: string): number {
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(entry.parentPath ?? dir, entry.name);
    newest = Math.max(newest, entry.isDirectory() ? newestMtime(full) : fs.statSync(full).mtimeMs);
  }
  return newest;
}

function ensureFreshDist(dist: string): void {
  const indexHtml = path.join(dist, "index.html");
  const built = fs.existsSync(indexHtml) ? fs.statSync(indexHtml).mtimeMs : 0;
  const sources = Math.max(
    newestMtime(path.join(ROOT, "web", "src")),
    newestMtime(path.join(ROOT, "shared", "src")),
    fs.statSync(path.join(ROOT, "web", "index.html")).mtimeMs,
  );
  if (sources <= built) return;
  console.log("[server] frontend changed since last build — rebuilding…");
  const result = spawnSync("node", [path.join(ROOT, "node_modules", "vite", "bin", "vite.js"), "build"], {
    cwd: path.join(ROOT, "web"),
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.status !== 0) console.warn("[server] frontend rebuild failed — serving the previous build");
}

if (isProd) {
  const dist = path.join(ROOT, "web", "dist");
  ensureFreshDist(dist);
  app.use(express.static(dist));
  // SPA fallback — but never for API paths: those should 404 as JSON.
  app.get("/*splat", (req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: `no such endpoint: ${req.path}` });
      return;
    }
    res.sendFile(path.join(dist, "index.html"));
  });
}

// API errors must come back as JSON, never as Express's HTML error page —
// the frontend (and the tutor's tools) always parse responses as JSON.
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server] unhandled error:", err);
  if (!res.headersSent) res.status(500).json({ error: err.message ?? "internal error" });
});

app.listen(PORT, async () => {
  console.log(`[server] listening on http://localhost:${PORT}${isProd ? " (production)" : ""}`);
  const cur = await getCurriculum(CONTENT_DIR);
  if (cur.errors.length > 0) {
    console.warn(`[content] ${cur.errors.length} validation error(s):`);
    for (const e of cur.errors) console.warn(`  ${e.file}: ${e.message}`);
  } else {
    console.log(`[content] ${cur.tracks.length} tracks, ${cur.lessons.size} lessons loaded`);
  }
  void selfTestAuth();
});
