# Grid

CSS Grid lays out items in **rows and columns at the same time** — true two-dimensional layout. Where flexbox is a line of items, grid is a chessboard.

## Switching it on

```css
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* three equal columns */
  gap: 16px;
}
```

```html
<div class="gallery">
  <img src="1.jpg" alt="..." />
  <img src="2.jpg" alt="..." />
  <img src="3.jpg" alt="..." />
  <img src="4.jpg" alt="..." />   <!-- wraps to row 2 automatically -->
</div>
```

Children fill the grid left to right, wrapping to new rows on their own.

## The fr unit and repeat()

`fr` means "one fraction of the free space":

```css
grid-template-columns: repeat(3, 1fr);    /* same as 1fr 1fr 1fr */
grid-template-columns: 200px 1fr;         /* fixed sidebar + flexible rest */
grid-template-columns: 2fr 1fr;           /* left column twice as wide */
```

## Responsive grids with zero media queries

The most magical line in CSS:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
```

Read it as: "make as many columns as fit, each at least 220px, sharing leftover space." Shrink the window and cards reflow from 4 across to 3, 2, 1 — automatically.

## Placing items by hand

Items can span multiple columns or rows:

```css
.featured {
  grid-column: 1 / 3;   /* from column line 1 to line 3 = spans 2 columns */
  grid-row: span 2;     /* covers two rows */
}
```

## Named areas: layout you can read

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

header { grid-area: header; }
nav    { grid-area: sidebar; }
main   { grid-area: main; }
footer { grid-area: footer; }
```

The `grid-template-areas` block is a little ASCII picture of your page — repeating a name makes that area span those cells.

## Grid or flexbox?

- A row of buttons, a nav bar, centering one thing → **flexbox**
- A photo gallery, card grid, or whole-page layout → **grid**

They combine happily: a grid for the page, flexbox inside each card.
