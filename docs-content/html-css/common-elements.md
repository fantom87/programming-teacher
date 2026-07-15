# Common elements

A small set of HTML elements covers most of what you'll ever write. Here they are.

## Headings

Six levels, `<h1>` (most important) to `<h6>` (least). They create an outline of your page:

```html
<h1>My Cooking Blog</h1>
<h2>Breakfast Recipes</h2>
<h3>Pancakes</h3>
```

Use one `<h1>` per page, and don't skip levels just because a smaller heading "looks right" — size is CSS's job; headings describe *structure*.

## Paragraphs and line breaks

```html
<p>Each paragraph gets its own p element.</p>
<p>Roses are red,<br />violets are blue.</p>   <!-- br forces a line break -->
```

## Emphasis

```html
<p>This is <strong>really important</strong>.</p>   <!-- strong importance, shown bold -->
<p>I <em>love</em> pancakes.</p>                    <!-- stress emphasis, shown italic -->
```

Prefer these over `<b>` and `<i>` — they carry meaning, not just style.

## Generic containers: div and span

When no meaningful element fits, use these neutral wrappers with a class:

```html
<div class="card">          <!-- div: a block-level box -->
  <p>A <span class="highlight">highlighted</span> word.</p>  <!-- span: inline -->
</div>
```

`<div>` stacks like a paragraph; `<span>` flows inside text. Reach for semantic elements (`<article>`, `<nav>`, `<section>`...) first — see the semantic HTML page.

## Quotes and code

```html
<blockquote>
  <p>Stay hungry, stay foolish.</p>
</blockquote>

<p>Call <code>console.log()</code> to print.</p>

<pre><code>function add(a, b) {
  return a + b;
}</code></pre>   <!-- pre preserves spacing and line breaks -->
```

## Buttons

```html
<button type="button">Click me</button>
```

Use a real `<button>` for anything clickable that isn't a link — it works with keyboards and screen readers for free.

## Comments

```html
<!-- Notes for humans; the browser ignores them -->
```

That's the everyday toolkit: headings for structure, paragraphs for text, strong/em for meaning, div/span as last resorts, and buttons for actions.
