import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");
export const DATA_DIR = path.join(ROOT, "data");

const isProd = process.argv.includes("--prod");
const PORT = 4517;

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    version: "0.1.0",
    runtimes: {}, // filled in by preflight in M2
    sdkAuth: "unknown", // filled in by tutor service in M3
  });
});

if (isProd) {
  const dist = path.join(ROOT, "web", "dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}${isProd ? " (production)" : ""}`);
});
