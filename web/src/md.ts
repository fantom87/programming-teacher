// Single markdown pipeline for everything that renders via
// dangerouslySetInnerHTML: parse with marked, syntax-highlight fenced code
// blocks with the CodeMirror/Lezer parsers we already bundle, then sanitize
// with DOMPurify. marked passes raw inline HTML through by design — without
// the sanitize step a tutor reply like "add <img src=x onerror=...>" becomes
// live DOM in the app origin.
import { Marked } from "marked";
import DOMPurify from "dompurify";
import { classHighlighter, highlightCode } from "@lezer/highlight";
import { StreamLanguage } from "@codemirror/language";
import { javascriptLanguage, typescriptLanguage } from "@codemirror/lang-javascript";
import { pythonLanguage } from "@codemirror/lang-python";
import { htmlLanguage } from "@codemirror/lang-html";
import { cssLanguage } from "@codemirror/lang-css";
import { csharp } from "@codemirror/legacy-modes/mode/clike";

const csharpLanguage = StreamLanguage.define(csharp);

function parserFor(lang: string) {
  switch (lang) {
    case "js":
    case "jsx":
    case "javascript":
      return javascriptLanguage.parser;
    case "ts":
    case "tsx":
    case "typescript":
      return typescriptLanguage.parser;
    case "py":
    case "python":
      return pythonLanguage.parser;
    case "html":
      return htmlLanguage.parser;
    case "css":
      return cssLanguage.parser;
    case "cs":
    case "csharp":
    case "c#":
      return csharpLanguage.parser;
    default:
      return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Emit `<span class="tok-…">` runs (theme.css colors them in both themes). */
function highlight(code: string, lang: string): string {
  const parser = parserFor(lang);
  if (!parser) return escapeHtml(code);
  try {
    let out = "";
    highlightCode(
      code,
      parser.parse(code),
      classHighlighter,
      (text, classes) => {
        out += classes ? `<span class="${classes}">${escapeHtml(text)}</span>` : escapeHtml(text);
      },
      () => {
        out += "\n";
      },
    );
    return out;
  } catch {
    return escapeHtml(code); // a parser hiccup must never break rendering
  }
}

// Own Marked instance: configuring the global `marked` would silently change
// rendering for any other module that imports it.
const md = new Marked({
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? "").trim().split(/\s+/)[0].toLowerCase();
      const cls = language ? ` class="language-${escapeHtml(language)}"` : "";
      return `<pre><code${cls}>${highlight(text, language)}</code></pre>\n`;
    },
  },
});

/** Markdown → sanitized HTML, safe for dangerouslySetInnerHTML. */
export function renderMarkdown(source: string): string {
  return DOMPurify.sanitize(md.parse(source, { async: false }));
}
