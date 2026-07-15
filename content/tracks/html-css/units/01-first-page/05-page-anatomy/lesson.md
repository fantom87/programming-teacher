---
id: 05-page-anatomy
title: Page Anatomy
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
goal: "Write a complete HTML document — DOCTYPE, html, head with a title, and body — whose body is organized into header, main, and footer landmarks."
docs: [html-css/document-structure, html-css/semantic-html]
checks:
  - id: document-head
    type: dom
    assertions:
      - { selector: "title", exists: true }
  - id: landmarks
    type: dom
    assertions:
      - { selector: "header", exists: true }
      - { selector: "main", count: 1 }
      - { selector: "footer", exists: true }
  - id: real-content
    type: dom
    assertions:
      - { selector: "header h1", exists: true }
      - { selector: "main p", exists: true }
hints:
  - "The skeleton: <!DOCTYPE html>, then <html> wrapping <head> and <body>."
  - "<title> lives inside <head> — it names the browser tab, not the page content."
  - "Inside <body>: <header> (top banner), <main> (the actual content, exactly one), <footer> (the bottom)."
---
## The full skeleton

Until now you've written HTML fragments and the browser has quietly filled in
the rest. Time to write the whole document yourself — every real page ships
with this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Shown in the browser tab</title>
  </head>
  <body>
    <!-- everything visible goes here -->
  </body>
</html>
```

`<!DOCTYPE html>` tells the browser "this is modern HTML". The `<head>` holds
information *about* the page — its `<title>`, links to stylesheets — nothing in
it is drawn on screen. The `<body>` is everything you see.

Inside the body, three **landmark** elements give the page a standard anatomy:

- `<header>` — the banner at the top: site name, logo, navigation
- `<main>` — the actual content; every page has **exactly one**
- `<footer>` — the bottom strip: credits, copyright, small print

Landmarks look like plain boxes, so why bother? Because software reads them.
Screen readers jump straight to `<main>`, search engines weigh it more heavily,
and next lesson your CSS will grab these regions by name.

### Your goal

Starting from the empty file, write a complete document for a tiny personal
site:

1. The full skeleton: `<!DOCTYPE html>`, `<html>`, `<head>` with a `<title>`,
   and `<body>`.
2. A `<header>` containing your `<h1>` site name.
3. One `<main>` containing at least a `<p>` about the site.
4. A `<footer>` with a sign-off line.
