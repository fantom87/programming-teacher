# Flexbox

Flexbox lays out items **in a row or a column** and makes the hard things easy: centering, equal spacing, and items that grow or shrink to fit.

## Switching it on

Set `display: flex` on a **container**; its direct children become **flex items**:

```css
.toolbar {
  display: flex;
}
```

```html
<div class="toolbar">
  <button>Cut</button>
  <button>Copy</button>
  <button>Paste</button>
</div>
```

The buttons now sit side by side in a row.

## Direction

```css
.toolbar { flex-direction: row; }      /* default: left to right */
.sidebar { flex-direction: column; }   /* top to bottom */
```

Flexbox thinks in a **main axis** (the direction items flow) and a **cross axis** (perpendicular to it).

## The two alignment properties

```css
.toolbar {
  display: flex;
  justify-content: space-between;  /* along the MAIN axis */
  align-items: center;             /* along the CROSS axis */
}
```

`justify-content` options: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.

`align-items` options: `stretch` (default), `center`, `flex-start`, `flex-end`.

### The famous centering trick

```css
.hero {
  display: flex;
  justify-content: center;   /* horizontal */
  align-items: center;       /* vertical */
  min-height: 100vh;
}
```

Perfectly centered content, three lines. This used to be genuinely hard.

## Space between items: gap

```css
.toolbar {
  display: flex;
  gap: 12px;    /* consistent spacing, no margin juggling */
}
```

## Growing and shrinking

Control how items share leftover space:

```css
.search-bar   { display: flex; gap: 8px; }
.search-input { flex: 1; }    /* grow to fill all spare room */
```

Now the input stretches and the button next to it keeps its natural size. A common layout — sidebar plus flexible main area:

```css
.layout  { display: flex; }
.sidebar { flex: 0 0 220px; }  /* fixed 220px, no grow, no shrink */
.content { flex: 1; }          /* everything else */
```

## Wrapping

```css
.tags {
  display: flex;
  flex-wrap: wrap;   /* items flow onto new lines instead of squishing */
  gap: 8px;
}
```

Rule of thumb: flexbox for one-dimensional layouts (a row *or* a column). For two dimensions at once — rows *and* columns — see the grid page.
