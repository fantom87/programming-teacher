---
id: 08-arrays-first-look
title: "Arrays: First Look"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Create a colors array of red, green, blue; print the first item; push yellow; print the new length; then loop and print every color."
docs: [javascript/arrays, javascript/loops]
checks:
  - id: array-correct
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-array-story
    type: stdout
    entry: main.js
    match: exact
    value: "red\n4\nred\ngreen\nblue\nyellow\n"
hints:
  - "An array is made with square brackets: const colors = [\"red\", \"green\", \"blue\"];"
  - "Positions start at 0 — colors[0] is the first item. colors.push(\"yellow\") adds to the end, colors.length counts."
  - "The loop: for (const color of colors) { console.log(color); }"
---
## One name, many values

You've stored one value per variable. An **array** stores a whole list
under one name:

```js
const colors = ["red", "green", "blue"];
```

Square brackets, commas between items. Now the fundamentals, rapid-fire:

**Reading by position** — brackets again, and positions start at **0**:

```js
console.log(colors[0]);   // red   (the FIRST item is [0]!)
console.log(colors[2]);   // blue
```

**Adding to the end** — `.push(...)`:

```js
colors.push("yellow");    // now ["red", "green", "blue", "yellow"]
```

(Yes, even though `colors` is a `const` — `const` means the *name* can't
point to a different array; the array's *contents* can still change.)

**Counting** — `.length`:

```js
console.log(colors.length);   // 4
```

**Visiting every item** — the `for...of` loop, which hands you each item
in order:

```js
for (const color of colors) {
  console.log(color);
}
```

Arrays and loops are a natural pair — a list plus "do this for each item"
covers half of everyday programming.

### Your goal

In this order:

1. Create an array `colors` holding `"red"`, `"green"`, `"blue"`.
2. Print the **first** item (mind the zero!).
3. `push` the string `"yellow"` onto the end.
4. Print the array's **length**.
5. Loop over `colors` with `for...of`, printing each color.

```
red
4
red
green
blue
yellow
```
