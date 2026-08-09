---
id: 02-optional-chaining
title: Optional Chaining
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write cityOf, firstTag, and scoreLine with ?. and ?? — walk into data that might be missing without crashing, keep a score of 0 as real data — and print the six demo lines."
docs: [javascript/objects, javascript/conditionals]
checks:
  - id: safe-lookups-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "London\nunknown\njavascript\nuntagged\nscore: 0\nscore: n/a\n"
  - id: real-optional-chaining
    type: ai-judge
    rubric: "cityOf and firstTag reach into the data with optional chaining (?. and ?.[...]) and supply their fallbacks with ?? — no && guard chains, no if/else ladders, no try/catch swallowing the TypeError. scoreLine uses ?? (NOT ||) so a score of 0 prints as 0. Nothing is hardcoded per demo input."
hints:
  - "cityOf is one line: return user?.address?.city ?? \"unknown\"; — every ?. marks a place the data is allowed to stop."
  - "For array lookups the ?. goes before the bracket: post.tags?.[0] — then ?? supplies \"untagged\"."
  - "scoreLine is the || trap: player.score || \"n/a\" turns a real 0 into n/a. Use ?? — it only falls back on null/undefined."
---
## The question-mark dot

Real data has holes. A user might have no address, a post might have no
tags, an API might hand you `null` where you expected an object. Reach
one level too deep and JavaScript throws its most famous error:

```js
user.address.city
// TypeError: Cannot read properties of undefined (reading 'city')
```

**Optional chaining** — `?.` — asks instead of assuming: *if the thing
before me is `null` or `undefined`, stop here and produce `undefined`;
otherwise keep going.*

```js
user?.address?.city     // undefined instead of a crash
post.tags?.[0]          // works before brackets too
```

Its partner is **nullish coalescing** — `??` — which turns that
`undefined` into an answer you actually want:

```js
const city = user?.address?.city ?? "unknown";
```

Why `??` and not the `||` you already know? Because `||` falls back on
*every* falsy value — including `0` and `""`, which are usually real
data. A player with a score of `0`: `player.score || "n/a"` wrongly
reports `n/a`; `player.score ?? "n/a"` keeps the `0`. That one-character
choice is the difference between a scoreboard bug and correct code — and
one of today's tests aims straight at it.

One professional habit before you start: `?.` is for data that is
*legitimately allowed* to be missing. Don't sprinkle it everywhere "just
in case" — when a value should always exist, you *want* the loud
TypeError right next to the real bug, not an `undefined` drifting
quietly through your program.

The starter data has one of everything: a user with an address and a
drifter without, a tagged post and a bare one, a veteran whose score is
genuinely `0` and a rookie with no score at all.

### Your goal

1. `cityOf(user)` — the user's `address.city`, or `"unknown"` if the
   user, the address, or the city is missing — even `cityOf(null)` must
   be safe.
2. `firstTag(post)` — the first entry of `post.tags`, or `"untagged"`.
3. `scoreLine(player)` — return `` `score: ${...}` `` using the player's
   `score` with fallback `"n/a"` — a score of `0` must survive.
4. Print the six demo calls from the starter comments:

```
London
unknown
javascript
untagged
score: 0
score: n/a
```
