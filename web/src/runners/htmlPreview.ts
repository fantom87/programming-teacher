// Builds the iframe srcdoc for HTML/CSS lessons: the user's HTML with any
// linked local stylesheets inlined (the iframe can't fetch lesson files).

export function buildSrcdoc(files: Record<string, string>): string {
  const entry = Object.keys(files).find((f) => f.endsWith(".html"));
  let html = entry ? files[entry] : "<p>(no .html file)</p>";
  for (const [name, contents] of Object.entries(files)) {
    if (name.endsWith(".css")) {
      const linkRe = new RegExp(`<link[^>]*href=["']${name.replace(".", "\\.")}["'][^>]*>`, "i");
      if (linkRe.test(html)) html = html.replace(linkRe, `<style>${contents}</style>`);
    }
  }
  return html;
}
