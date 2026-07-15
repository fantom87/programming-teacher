# Semantic HTML

"Semantic" means *meaningful*. Semantic HTML uses elements that describe what content **is**, not just how it looks. A `<div>` says nothing; a `<nav>` says "this is the navigation."

## Why bother?

- **Screen readers** can announce regions and let users jump straight to the main content.
- **Search engines** understand your page better.
- **You** can read your own code six months later.

Compare:

```html
<!-- Mystery soup -->
<div class="top">...</div>
<div class="stuff">...</div>
<div class="bottom">...</div>

<!-- Self-explanatory -->
<header>...</header>
<main>...</main>
<footer>...</footer>
```

## The landmark elements

A typical page layout:

```html
<body>
  <header>
    <h1>The Daily Bugle</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/sports">Sports</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Local Cat Learns to Code</h2>
      <p>Residents were amazed...</p>
    </article>

    <aside>
      <h2>Related stories</h2>
    </aside>
  </main>

  <footer>
    <p>© 2026 The Daily Bugle</p>
  </footer>
</body>
```

What each one means:

- **`<header>`** — introductory content: logo, title, navigation
- **`<nav>`** — a group of navigation links
- **`<main>`** — the unique content of this page (one per page)
- **`<article>`** — a self-contained piece that would make sense on its own: a blog post, news story, product card
- **`<section>`** — a thematic grouping, usually with its own heading
- **`<aside>`** — related-but-separate content: sidebars, "you may also like"
- **`<footer>`** — closing content: copyright, contact links

## Smaller semantic touches

```html
<time datetime="2026-07-15">July 15, 2026</time>
<figure>
  <img src="chart.png" alt="Sales rising through 2026" />
  <figcaption>Sales by month</figcaption>
</figure>
```

## When is a div okay?

When you need a wrapper purely for styling or layout and no semantic element fits. That's fine — divs aren't wrong, they're just meaningless. The habit to build: **reach for a meaningful element first, fall back to div second.**
