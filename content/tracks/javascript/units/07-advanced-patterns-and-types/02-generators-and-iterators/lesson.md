---
id: 02-generators-and-iterators
title: Generators and Iterators
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Write countdown(from), an infinite naturals(), and a lazy take(iterable, count) — generator functions that pause at yield — then drive one by hand with next() and prove take can sip five values from an endless stream."
docs: [javascript/functions-and-closures, javascript/loops, javascript/arrays]
checks:
  - id: generators-behave
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: demo-output
    type: stdout
    entry: main.js
    match: exact
    value: "{ value: 3, done: false }\n2\n1\nliftoff!\n1,2,3,4,5\nruby,amber\n"
  - id: genuinely-lazy
    type: ai-judge
    rubric: "countdown, naturals, and take are all declared function* and produce values with yield. naturals is genuinely infinite — while (true) yielding an incrementing number — with no cap parameter. take loops over its iterable with for...of, yields at most count items, and exits early via return or break; it never spreads or collects the source into an array (that would hang on naturals). The demo's '{ value: 3, done: false }', '2', and '1' lines all come from ONE countdown(3) iterator driven by next(), next().value, then a for...of over the SAME iterator — not from fresh generators or hardcoded logs — and the take lines are built by spreading take(...) and joining with commas."
hints:
  - "function* countdown(from) { for (let n = from; n >= 1; n--) yield n; } — the star makes it a generator, and each yield pauses the function mid-loop until someone asks again."
  - "Infinite is fine when nobody runs the loop to the end: function* naturals() { let n = 1; while (true) yield n++; } — it only advances one next() at a time."
  - "take re-yields as it reads: let taken = 0; for (const item of iterable) { if (taken >= count) return; yield item; taken += 1; } — the return ends the generator early, so naturals never runs away."
---
## Functions that pause

A normal function runs start-to-finish. A **generator function** —
declared `function*` — can *pause*. Each `yield` hands a value out and
freezes the function, local variables intact, until someone asks for
the next one:

```js
function* countdown(from) {
  for (let n = from; n >= 1; n--) yield n;
}
```

Calling `countdown(3)` runs *none* of that code. It returns an
**iterator** — an object with a `next()` method. Every `next()` resumes
the function until the following `yield` and returns
`{ value: 3, done: false }`; when the function finally ends you get
`done: true`. That `{ value, done }` handshake is the **iterator
protocol**, and it's the machinery `for...of` and spread have been using
under you since Foundations. Anything that speaks it — arrays, strings,
Maps, your generators — plugs into the same loops.

The pause is the superpower: values are produced **lazily**, one per
request. Which means this is perfectly legal:

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
```

An infinite loop that never hangs — because it only runs between
requests. Pair it with a second generator that *consumes* another
iterable and re-yields at most `count` items, and you have the lazy
pipeline pattern that libraries like RxJS industrialize:

```js
[...take(naturals(), 5)]   // [1, 2, 3, 4, 5] — the stream stopped politely
```

`take` must read with `for...of` and bail early — collect the source
into an array first and the infinite stream wins.

### Your goal

1. `countdown(from)` — yields `from` down to `1`.
2. `naturals()` — yields `1, 2, 3, ...` forever.
3. `take(iterable, count)` — lazily yields at most `count` items from
   any iterable.
4. The demo, driving one `countdown(3)` iterator all the way: print
   `next()` raw, then `next().value`, then finish it with `for...of`,
   then `liftoff!` — followed by the two `take` lines:

```
{ value: 3, done: false }
2
1
liftoff!
1,2,3,4,5
ruby,amber
```

(The last line is `take(["ruby", "amber", "jade"], 2)` — proof `take`
works on any iterable, not just generators.)
