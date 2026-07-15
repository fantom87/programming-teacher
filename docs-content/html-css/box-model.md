# The box model

Every element on a page is a rectangular box, and every box has four layers. Understanding them is the key to controlling layout and spacing.

## The four layers

From the inside out:

1. **Content** — the text or image itself
2. **Padding** — breathing room *inside* the border
3. **Border** — the edge of the box
4. **Margin** — space *outside* the border, pushing neighbors away

```css
.card {
  width: 300px;
  padding: 16px;              /* space between text and border */
  border: 2px solid #ccc;     /* the visible edge */
  margin: 24px;               /* gap between this card and others */
}
```

A memory trick: **padding is inside the walls, margin is the yard.**

## Padding vs margin — which one?

- Background color fills the padding but **not** the margin.
- Want the box bigger and cozier inside? Padding.
- Want space between boxes? Margin.

## Shorthand values

```css
padding: 10px;                /* all four sides */
padding: 10px 20px;           /* top/bottom 10, left/right 20 */
padding: 10px 20px 5px 15px;  /* top, right, bottom, left — clockwise */

margin: 0 auto;               /* top/bottom 0, left/right auto = centers a
                                 block that has a width */
```

## box-sizing: make width mean width

By default, `width` sets only the *content* width — padding and border are added on top, so a "300px" box is actually 336px wide in the example above. Nearly every project fixes this globally:

```css
* {
  box-sizing: border-box;   /* width now includes padding and border */
}
```

With `border-box`, a 300px box is 300px, period. Do this at the top of every stylesheet.

## Seeing the boxes

Two great tricks while learning:

```css
* { outline: 1px solid red; }   /* temporarily outline everything */
```

Or open DevTools, click any element, and look at the colored box-model diagram in the Styles panel — it shows content, padding, border, and margin measured live.

## Block vs inline

Block elements (`div`, `p`, `h1`) take the full width and stack vertically; inline elements (`span`, `a`, `strong`) flow within text and ignore top/bottom margins. `display: inline-block` or flexbox gives you the best of both.
