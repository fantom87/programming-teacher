# Responsive design

Responsive design means one page that works everywhere — a phone in one hand, a widescreen monitor, and everything between. Instead of fixed sizes, you write flexible rules and adjust them at certain widths.

## Step zero: the viewport meta tag

Without this line in your `<head>`, phones pretend to be desktops and shrink everything:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Flexible by default

Prefer relative units and let content breathe:

```css
img {
  max-width: 100%;    /* images never overflow their container */
  height: auto;
}

.container {
  max-width: 1000px;  /* stop growing on huge screens */
  margin: 0 auto;     /* stay centered */
  padding: 0 1rem;    /* breathing room on small screens */
}
```

`%`, `rem`, and `fr` bend with the screen; `px` doesn't.

## Media queries: rules that apply conditionally

A media query says "only apply these styles when the screen matches":

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;       /* phones: one column */
  gap: 1rem;
}

@media (min-width: 600px) {
  .cards { grid-template-columns: 1fr 1fr; }      /* tablets: two */
}

@media (min-width: 900px) {
  .cards { grid-template-columns: repeat(3, 1fr); } /* desktops: three */
}
```

This is **mobile-first**: the plain rules serve the smallest screens, and `min-width` queries layer on enhancements as space grows. It's the easiest approach to reason about.

## Common responsive moves

```css
/* Stack a sidebar under the content on phones */
.layout { display: flex; flex-direction: column; }

@media (min-width: 800px) {
  .layout { flex-direction: row; }
}

/* Hide something on small screens */
@media (max-width: 599px) {
  .desktop-only { display: none; }
}
```

And remember grid's self-responsive trick, which often needs no media query at all:

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

## Testing

Open DevTools and click the device toolbar icon (Ctrl+Shift+M) to preview phone and tablet sizes — or simply drag your browser window narrower and watch where the layout breaks. Wherever it breaks is where your next media query goes: let the *content* choose the breakpoints, not a list of device names.
