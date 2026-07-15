# Colors and typography

Color and text styling are where CSS gets fun — and where a few good habits make pages instantly look more polished.

## Ways to write a color

```css
.box {
  color: tomato;                    /* named color — handy for experiments */
  color: #ff6347;                   /* hex — the most common in real code */
  color: rgb(255 99 71);            /* red, green, blue: 0–255 each */
  color: hsl(9 100% 64%);           /* hue, saturation, lightness */
  color: rgb(255 99 71 / 0.5);      /* the /0.5 makes it 50% transparent */
}
```

HSL is friendly for humans: keep the hue, nudge the lightness, and you get lighter/darker shades of the same color.

## Where colors go

```css
.card {
  color: #1a1a2e;               /* text color */
  background-color: #f5f5f5;    /* fill */
  border: 1px solid #ddd;
}
```

Keep text contrast strong — dark text on light backgrounds (or the reverse). If you squint and the text disappears, so will your users.

## Font families

```css
body {
  font-family: Georgia, "Times New Roman", serif;
}
```

That's a **font stack**: the browser tries each in order and the last is a generic fallback (`serif`, `sans-serif`, or `monospace`). A safe modern default:

```css
body {
  font-family: system-ui, sans-serif;   /* whatever the OS uses — always looks native */
}
```

## Size, weight, and spacing

```css
h1 {
  font-size: 2rem;        /* rem = multiples of the root size (usually 16px) */
  font-weight: 700;       /* 400 normal, 700 bold */
}

p {
  font-size: 1rem;
  line-height: 1.6;       /* space between lines — 1.5–1.7 reads best */
}
```

Prefer `rem` over `px` for font sizes: it respects users who bump their browser's default text size.

## Small touches that read well

```css
p {
  max-width: 65ch;          /* lines about 65 characters long — easy on the eyes */
}

.subtle {
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

A reliable starter recipe: `system-ui` font, `line-height: 1.6`, `max-width: 65ch` on paragraphs, one accent color, and generous spacing. Simple beats fancy.
