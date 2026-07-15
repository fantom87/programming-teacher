# Lists and tables

Some content is naturally a list; some is naturally a grid of rows and columns. HTML has proper elements for both.

## Unordered lists: bullet points

```html
<ul>
  <li>Milk</li>
  <li>Eggs</li>
  <li>Bread</li>
</ul>
```

`<ul>` is the list; each `<li>` is one item. Use when order doesn't matter.

## Ordered lists: numbered steps

```html
<ol>
  <li>Preheat the oven.</li>
  <li>Mix the batter.</li>
  <li>Bake for 25 minutes.</li>
</ol>
```

The browser numbers them automatically — add or reorder items and the numbers fix themselves.

## Nesting lists

Put a whole list *inside* an `<li>`:

```html
<ul>
  <li>Fruit
    <ul>
      <li>Apples</li>
      <li>Pears</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>
```

## Tables: rows and columns

Tables are for **data** — schedules, scores, price comparisons. (Never for page layout; CSS grid and flexbox do that.)

```html
<table>
  <thead>
    <tr>
      <th scope="col">Planet</th>
      <th scope="col">Moons</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Earth</td>
      <td>1</td>
    </tr>
    <tr>
      <td>Mars</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
```

The pieces:

- **`<table>`** wraps everything
- **`<thead>` / `<tbody>`** group the header row and the data rows
- **`<tr>`** is a table row
- **`<th>`** is a header cell — `scope="col"` says it labels a column
- **`<td>`** is a regular data cell

Those `<th>` and `scope` details matter: they let screen readers announce which column a number belongs to.

## A caption gives the table a title

```html
<table>
  <caption>Moons per planet</caption>
  ...
</table>
```

Quick test for which to use: "Could I say this as *first, second, third*?" → `<ol>`. "Is it just a set of things?" → `<ul>`. "Does each item have several labeled facts?" → `<table>`.
