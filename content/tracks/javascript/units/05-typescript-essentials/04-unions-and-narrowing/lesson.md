---
id: 04-unions-and-narrowing
title: Unions and Narrowing
language: javascript
runner: local
estMinutes: 18
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Write normalizeId over a string | number union using typeof narrowing, and alarm over a literal union of levels — then print the five goal lines like #0042."
docs: [javascript/typescript-basics, javascript/conditionals]
checks:
  - id: ids-and-alarms
    type: stdout
    entry: main.ts
    match: exact
    value: "#0042\n#ORDER-9\nvolume 2\nvolume 5\nvolume 10\n"
  - id: narrows-not-guesses
    type: ai-judge
    rubric: "A type alias Id = string | number exists and normalizeId takes an Id, branching with typeof (e.g. typeof id === \"number\") — the number branch pads with padStart, the string branch uppercases. Level is a type alias union of exactly the three string literals \"low\" | \"medium\" | \"high\", and alarm(level: Level) picks its volume by comparing level (if/else or switch), not by indexing a magic array. No any, no as casts to dodge narrowing."
hints:
  - "type Id = string | number; — then inside normalizeId, if (typeof id === \"number\") { ... } gives you a branch where id IS a number."
  - "Number branch: \"#\" + String(id).padStart(4, \"0\"). String branch: \"#\" + id.toUpperCase()."
  - "type Level = \"low\" | \"medium\" | \"high\"; — alarm returns \"volume 2\", \"volume 5\", or \"volume 10\" via if (level === \"low\") ... else if ... else."
---
## One of these, or one of those

Real data is rarely one type. An order ID might arrive as `42` or as
`"order-9"`. TypeScript writes that truth with a **union**:

```ts
type Id = string | number;
```

Read `|` as *or*. Here's the catch that makes unions powerful: given
`id: Id`, TypeScript won't let you call `id.toUpperCase()` — `id` might
be a number. You must **narrow** first:

```ts
function normalizeId(id: Id): string {
  if (typeof id === "number") {
    return "#" + String(id).padStart(4, "0");  // here, id is a number
  }
  return "#" + id.toUpperCase();               // here, it can only be a string
}
```

That's ordinary JavaScript `typeof` — no special syntax. TypeScript
*follows your control flow*: inside the `if`, `id` is `number`; after
the early return, only `string` remains, so `.toUpperCase()` is suddenly
legal. The compiler reads your branches like a detective ruling out
suspects. (Our runner strips the types, but write the narrowing anyway —
it's also just correct runtime logic, and the checker runs both cases.)

The second trick: in TypeScript, a *value* can be a type. `"low"` is the
type whose only value is `"low"` — a **literal type**. Union a few and
you've got a closed set of allowed strings:

```ts
type Level = "low" | "medium" | "high";
```

Pass `alarm("midium")` and tsc catches the typo at compile time — this
is the modern, erasable replacement for `enum`, and you'll see it in
every real codebase. Equality checks narrow literal unions the same way
`typeof` narrows primitives: after `if (level === "low")`, TypeScript
knows exactly which literal it's holding.

### Your goal

1. `type Id = string | number`, then `normalizeId(id: Id): string` —
   numbers become `"#" + String(id).padStart(4, "0")`, strings become
   `"#" + id.toUpperCase()`. Narrow with `typeof`.
2. `type Level = "low" | "medium" | "high"`, then
   `alarm(level: Level): string` returning `volume 2` / `volume 5` /
   `volume 10`.
3. Print `normalizeId(42)`, `normalizeId("order-9")`, then `alarm` for
   all three levels in order:

```
#0042
#ORDER-9
volume 2
volume 5
volume 10
```
