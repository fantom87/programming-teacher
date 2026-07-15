import express from "express";
import path from "node:path";
import fs from "node:fs";
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

if (isProd) {
  const dist = path.join(ROOT, "web", "dist");
  app.use(express.static(dist));
  app.get("/*splat", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

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
