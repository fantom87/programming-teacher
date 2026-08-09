// Builds the iframe srcdoc for HTML/CSS lessons: the user's HTML with any
// linked local stylesheets inlined (the iframe can't fetch lesson files).
// The inlining itself is the shared helper, so the preview and the server's
// jsdom check can never drift apart again.
import { inlineStylesheets } from "@teacher/shared";

export function buildSrcdoc(files: Record<string, string>): string {
  const entry = Object.keys(files).find((f) => f.endsWith(".html"));
  const html = entry ? files[entry] : "<p>(no .html file)</p>";
  return inlineStylesheets(html, files);
}
