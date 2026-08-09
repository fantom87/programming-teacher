---
id: 06-generics
title: Generics
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Write first<T> (returns T | undefined) and longest<T extends { length: number }> — one generic pair that works for numbers, strings, and arrays alike — then print the four goal lines."
docs: [javascript/typescript-basics, javascript/functions-and-closures, javascript/arrays]
checks:
  - id: generic-pair-works
    type: stdout
    entry: main.ts
    match: exact
    value: "9\nember\nTypeScript\n3\n"
  - id: real-type-parameters
    type: ai-judge
    rubric: "first declares a type parameter <T>, takes T[] and returns T | undefined (returning items[0], not a loop that guesses). longest declares <T extends { length: number }> — a genuine constraint, not any — takes two T parameters and returns T, comparing .length (ties may go either way but a tie must not crash). Neither function uses any, and the printed values come from the four calls in the goal, not literals."
hints:
  - "The type parameter goes right after the name: function first<T>(items: T[]): T | undefined { return items[0]; }"
  - "A constraint says what T must at least have: function longest<T extends { length: number }>(a: T, b: T): T"
  - "Body of longest: return b.length > a.length ? b : a; — callers never write <string> themselves, inference fills T in."
---
## Write once, typed everywhere

You need the first element of an array. For numbers that's
`first(items: number[]): number | undefined`. Tomorrow you need it for
strings. Copy-paste the function with new annotations? There has to be a
better way — and `any` isn't it, because `any` throws away the answer's
type: take an `any[]`, return an `any`, and the caller is back to
unchecked chaos.

The better way is a **type parameter** — a placeholder type the caller
fills in:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Read `<T>` as "for some type T, chosen per call": hand `first` a
`number[]` and it returns `number | undefined`; hand it a `string[]`
and it returns `string | undefined`. One function, every element type,
zero checking lost. The `| undefined` is the honest part — an empty
array has no first element, and the type says so out loud.

And you almost never *write* the type when calling — TypeScript
**infers** it from the argument. `first([9, 8, 7])` fills in `T =
number` silently. You've been *using* generics all along, by the way:
`Song[]` is really `Array<Song>`, and last lesson's narrowing worked
inside them.

Sometimes "any type at all" is too loose. Suppose you want the longer of
two things — that only makes sense for things *with a length*. Say so
with a **constraint**:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a;
}
```

`T extends { length: number }` means: any type, as long as it has a
numeric `length`. Strings qualify. Arrays qualify. Numbers don't — and
`longest(3, 7)` becomes a compile error instead of `undefined`
weirdness at 2 a.m. Inside the body, `.length` is legal *because* the
constraint guarantees it.

### Your goal

1. `first<T>(items: T[]): T | undefined` — returns `items[0]`.
2. `longest<T extends { length: number }>(a: T, b: T): T` — whichever
   argument has the greater `.length` (a tie returns either).
3. Uncomment the starter's four prints:

```
9
ember
TypeScript
3
```
