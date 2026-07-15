import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";

export interface DocsIndexPage {
  slug: string;
  title: string;
  keywords: string[];
}

export interface DocsSection {
  section: string;
  pages: DocsIndexPage[];
}

const SECTIONS = ["concepts", "python", "javascript", "html-css", "csharp"];

export async function loadDocsIndex(docsDir: string): Promise<DocsSection[]> {
  const out: DocsSection[] = [];
  for (const section of SECTIONS) {
    try {
      const raw = await fs.readFile(path.join(docsDir, section, "index.json"), "utf8");
      const parsed = JSON.parse(raw) as { pages: DocsIndexPage[] };
      out.push({ section, pages: parsed.pages });
    } catch {
      // section not authored yet — fine
    }
  }
  return out;
}

export async function allDocSlugs(docsDir: string): Promise<string[]> {
  const index = await loadDocsIndex(docsDir);
  return index.flatMap((s) => s.pages.map((p) => `${s.section}/${p.slug}`));
}

export function docsRoutes(docsDir: string): Router {
  const r = Router();

  r.get("/api/docs", async (_req, res) => {
    res.json(await loadDocsIndex(docsDir));
  });

  r.get("/api/docs/page", async (req, res) => {
    const section = String(req.query.section ?? "");
    const slug = String(req.query.slug ?? "");
    if (!SECTIONS.includes(section) || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({ error: "bad section/slug" });
      return;
    }
    try {
      const md = await fs.readFile(path.join(docsDir, section, `${slug}.md`), "utf8");
      res.json({ section, slug, markdown: md });
    } catch {
      res.status(404).json({ error: `no doc ${section}/${slug}` });
    }
  });

  return r;
}
