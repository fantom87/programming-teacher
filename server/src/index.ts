import express from "express";
import path from "node:path";
import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { curriculumRoutes } from "./routes/curriculum.js";
import { progressRoutes } from "./routes/progress.js";
import { draftRoutes } from "./routes/drafts.js";
import { settingsRoutes } from "./routes/settings.js";
import { runRoutes } from "./routes/run.js";
import { tutorRoutes } from "./routes/tutor.js";
import { customLessonRoutes } from "./routes/customLesson.js";
import { docsRoutes } from "./routes/docs.js";
import { exportRoutes } from "./routes/export.js";
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

// This server runs code and spends the user's Claude subscription — it must
// only ever serve the local machine. Binding to 127.0.0.1 keeps the LAN out;
// the Host check keeps DNS-rebinding pages out (a hostile site can point its
// own hostname at 127.0.0.1, but can't forge the Host header).
const ALLOWED_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
app.use((req, res, next) => {
  if (ALLOWED_HOST.test(req.headers.host ?? "")) {
    next();
    return;
  }
  res.status(403).json({ error: "Programming Teacher only accepts local requests" });
});

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
app.use(customLessonRoutes(CONTENT_DIR, DATA_DIR));
app.use(docsRoutes(path.join(ROOT, "docs-content")));
app.use(exportRoutes(DATA_DIR));

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

// Unknown API paths 404 as JSON in every mode — the frontend (and the
// tutor's tools) always parse responses as JSON. Registered after the real
// routes and before the prod SPA fallback.
app.use("/api", (req, res) => {
  res.status(404).json({ error: `no such endpoint: ${req.baseUrl}${req.path}` });
});

// In prod, never serve a stale frontend: if any source file is newer than the
// built bundle, rebuild before serving. Keeps the desktop app honest after
// code changes — a restart is all it takes.
function newestMtime(dir: string): number {
  let newest = 0;
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0; // missing dir — nothing newer than the build
  }
  for (const entry of entries) {
    const full = path.join(entry.parentPath ?? dir, entry.name);
    try {
      newest = Math.max(newest, entry.isDirectory() ? newestMtime(full) : fs.statSync(full).mtimeMs);
    } catch {
      // entry vanished mid-scan — ignore
    }
  }
  return newest;
}

function mtimeOf(file: string): number {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return 0;
  }
}

function ensureFreshDist(dist: string): void {
  // Best-effort: any failure here must fall back to serving the existing
  // dist, never crash the desktop app's backend at boot.
  try {
    const built = mtimeOf(path.join(dist, "index.html"));
    const sources = Math.max(
      newestMtime(path.join(ROOT, "web", "src")),
      newestMtime(path.join(ROOT, "shared", "src")),
      mtimeOf(path.join(ROOT, "web", "index.html")),
      mtimeOf(path.join(ROOT, "web", "vite.config.ts")),
      mtimeOf(path.join(ROOT, "web", "package.json")),
    );
    if (sources === 0 || sources <= built) return; // sources missing, or dist is fresh
    console.log("[server] frontend changed since last build — rebuilding…");
    const result = spawnSync("node", [path.join(ROOT, "node_modules", "vite", "bin", "vite.js"), "build"], {
      cwd: path.join(ROOT, "web"),
      stdio: "inherit",
      windowsHide: true,
    });
    if (result.status !== 0) console.warn("[server] frontend rebuild failed — serving the previous build");
  } catch (err) {
    console.warn("[server] freshness check failed — serving the existing build:", err);
  }
}

if (isProd) {
  const dist = path.join(ROOT, "web", "dist");
  ensureFreshDist(dist);
  app.use(express.static(dist));
  // SPA fallback (API paths were already handled — and 404ed — above).
  app.get("/*splat", (_req, res) => {
    res.sendFile(path.join(dist, "index.html"));
  });
}

// API errors must come back as JSON, never as Express's HTML error page —
// the frontend (and the tutor's tools) always parse responses as JSON.
app.use(
  (
    err: Error & { status?: number; statusCode?: number },
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("[server] unhandled error:", err);
    if (res.headersSent) {
      next(err); // let Express close the half-sent response
      return;
    }
    res.status(err.status ?? err.statusCode ?? 500).json({ error: err.message || "internal error" });
  },
);

const server = app.listen(PORT, "127.0.0.1", async () => {
  console.log(`[server] listening on http://localhost:${PORT}${isProd ? " (production)" : ""}`);
  const cur = await getCurriculum(CONTENT_DIR);
  if (cur.errors.length > 0) {
    console.warn(`[content] ${cur.errors.length} validation error(s):`);
    for (const e of cur.errors) console.warn(`  ${e.file}: ${e.message}`);
  } else {
    console.log(`[content] ${cur.tracks.length} tracks, ${cur.lessons.size} lessons loaded`);
  }
  void selfTestAuth();
  // Terminal `npm run start` opens the browser; the Electron shell (which
  // spawns us with piped/ignored stdio, so no TTY) opens its own window.
  if (isProd && process.stdout.isTTY) {
    spawn("cmd", ["/c", "start", "", `http://localhost:${PORT}`], { windowsHide: true }).on("error", () => {});
  }
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[server] port ${PORT} is already in use — is Programming Teacher already running?`);
  } else {
    console.error("[server] failed to start:", err);
  }
  process.exit(1);
});
