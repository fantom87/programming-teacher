---
id: 09-objects-first-look
title: "Objects: First Look"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Create a player object with name, score, and level; set score to 150 with dot access; and increase level by 1 using its current value."
docs: [javascript/objects]
checks:
  - id: player-correct
    type: tests
    entry: main.js
    testFile: tests/test_main.js
hints:
  - "The shape: const player = { name: \"Ada\", score: 0, level: 1 }; — key colon value, commas between."
  - "Dot access reads AND writes: player.score = 150;"
  - "To level up using the current value: player.level = player.level + 1;"
---
## Labeled data

An array numbers its items: `[0]`, `[1]`, `[2]`. But lots of data isn't a
sequence — it's a *description*. A player has a name, a score, a level.
For that, JavaScript has **objects**: values stored under **named keys**:

```js
const hero = {
  name: "Grace",
  score: 200,
  level: 3,
};
```

Curly braces, then `key: value` pairs separated by commas. Read it as a
form: *name — Grace; score — 200; level — 3.*

### Dot access

Reach into an object with a dot:

```js
console.log(hero.name);    // Grace
console.log(hero.score);   // 200
```

The dot also *writes*:

```js
hero.score = 250;              // overwrite with a new value
hero.level = hero.level + 1;   // read the current value, add 1, store it back
```

That second line is a pattern you'll use constantly: the right side runs
first (read `hero.level`, get 3, add 1), then the result lands back in the
same spot. And as with arrays, `const` doesn't freeze the *contents* —
only which object the name points to.

Arrays answer "which one is first?" Objects answer "what is its name?"
Together they can describe almost anything — next lesson's mini-project
uses both.

### Your goal

1. Create an object `player` with three keys: `name` set to `"Ada"`,
   `score` set to `0`, `level` set to `1`.
2. The player earns points — set `player.score` to `150` with dot access.
3. Level up — increase `player.level` by 1, *using its current value*.
4. Print the whole object with `console.log(player)` to admire it.
