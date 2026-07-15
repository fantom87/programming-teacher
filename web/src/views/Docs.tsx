import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";

interface DocsPage {
  slug: string;
  title: string;
  keywords: string[];
}

interface DocsSection {
  section: string;
  pages: DocsPage[];
}

const SECTION_LABEL: Record<string, string> = {
  concepts: "Concepts",
  python: "Python",
  javascript: "JavaScript",
  "html-css": "HTML / CSS",
  csharp: "C#",
};

interface Props {
  /** "section/slug" to open initially */
  initial?: string | null;
  compact?: boolean; // drawer mode
}

export default function Docs({ initial, compact }: Props) {
  const [index, setIndex] = useState<DocsSection[]>([]);
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState<string | null>(initial ?? null);
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    fetch("/api/docs")
      .then((r) => r.json())
      .then(setIndex)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initial) setCurrent(initial);
  }, [initial]);

  useEffect(() => {
    if (!current) return;
    const [section, slug] = current.split("/");
    fetch(`/api/docs/page?section=${section}&slug=${slug}`)
      .then((r) => r.json())
      .then((j) => setMarkdown(j.markdown ?? `*Page ${current} not found.*`))
      .catch(() => setMarkdown("*Failed to load page.*"));
  }, [current]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return index;
    return index
      .map((s) => ({
        ...s,
        pages: s.pages.filter(
          (p) => p.title.toLowerCase().includes(q) || p.slug.includes(q) || p.keywords.some((k) => k.toLowerCase().includes(q)),
        ),
      }))
      .filter((s) => s.pages.length > 0);
  }, [index, search]);

  return (
    <div className={`docs-view ${compact ? "compact" : ""}`}>
      <nav className="docs-nav" aria-label="Documentation pages">
        <input
          className="chat-input docs-search"
          placeholder="Search docs…"
          value={search}
          aria-label="Search documentation"
          onChange={(e) => setSearch(e.target.value)}
        />
        {filtered.map((s) => (
          <div key={s.section}>
            <div className="docs-section-label">{SECTION_LABEL[s.section] ?? s.section}</div>
            {s.pages.map((p) => {
              const key = `${s.section}/${p.slug}`;
              return (
                <button
                  key={key}
                  className={`docs-link ${current === key ? "active" : ""}`}
                  onClick={() => setCurrent(key)}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        ))}
        {index.length === 0 && <p className="dim small">No docs yet.</p>}
      </nav>
      <article className="docs-body lesson-md">
        {current ? (
          <div dangerouslySetInnerHTML={{ __html: marked.parse(markdown) as string }} />
        ) : (
          <p className="dim">Pick a page — or search. These docs are always one Ctrl+D away.</p>
        )}
      </article>
    </div>
  );
}
