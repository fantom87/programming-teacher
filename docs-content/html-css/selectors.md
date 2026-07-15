# Selectors

CSS works in rules: a **selector** says *which* elements to style, and declarations say *how*.

```css
p {
  color: navy;      /* selector: p — every paragraph turns navy */
}
```

## The three you'll use constantly

```css
p        { color: navy; }     /* element: every <p> */
.card    { padding: 1rem; }   /* class: every element with class="card" */
#logo    { width: 120px; }    /* id: THE element with id="logo" */
```

```html
<p class="card">I match both p and .card</p>
<img id="logo" src="logo.png" alt="Site logo" />
```

Classes are the everyday workhorse — reusable and flexible. Ids must be unique per page, so save them for one-off elements.

## Combining selectors

```css
h1, h2, h3      { font-family: Georgia; }   /* comma: this OR that */
.card p         { color: grey; }            /* space: <p> ANYWHERE inside .card */
.card > p       { color: grey; }            /* >: <p> DIRECTLY inside .card */
p.warning       { color: red; }             /* no space: a <p> that HAS class warning */
```

That space-vs-no-space difference trips everyone up at first: `.card p` is two things (descendant), `p.warning` is one thing (both at once).

## Pseudo-classes: styling states

```css
a:hover          { text-decoration: underline; }  /* mouse over it */
button:focus-visible { outline: 3px solid blue; } /* keyboard focus */
input:disabled   { opacity: 0.5; }
li:first-child   { font-weight: bold; }           /* first item in its parent */
li:nth-child(odd){ background: #f5f5f5; }         /* zebra striping */
```

## Attribute selectors

```css
input[type="checkbox"] { accent-color: teal; }
a[href^="https"]       { color: green; }    /* href starts with https */
```

## When rules collide: specificity

If two rules target the same element, the more *specific* one wins: id beats class, class beats element. Same specificity? The later rule wins.

```css
p        { color: black; }
.intro   { color: blue; }    /* <p class="intro"> is blue — class beats element */
```

Practical advice: style mostly with single classes, keep selectors short, and you'll rarely fight specificity at all.
