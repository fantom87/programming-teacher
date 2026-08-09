---
id: 02-typing-functions-and-objects
title: Typing Functions and Objects
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Write three fully typed functions — formatPrice with a default, describeBook with an inline object type, and tagLine with an optional parameter — and print the five goal lines."
docs: [javascript/typescript-basics, javascript/functions-and-closures, javascript/objects]
checks:
  - id: prints-all-five
    type: stdout
    entry: main.ts
    match: exact
    value: "$12.50\n€3.99\nThe Mythical Man-Month (322 pages)\n[urgent] backup the server\nbackup the server\n"
  - id: signatures-are-contracts
    type: ai-judge
    rubric: "formatPrice types cents as number, gives symbol a default of \"$\" and returns string, computing the price from cents (divide by 100, toFixed) — no hardcoded \"$12.50\". describeBook's parameter uses an inline object type annotation { title: string; pages: number } (not any, not a named interface yet). tagLine marks tag optional with ? and branches on its presence. All three declare return types, and all five printed lines come from calls."
hints:
  - "formatPrice(cents: number, symbol: string = \"$\"): string — the default rides along in the parameter list. Body: symbol + (cents / 100).toFixed(2)."
  - "The object parameter: function describeBook(book: { title: string; pages: number }): string — semicolons between members."
  - "tagLine(text: string, tag?: string): string — inside, if (tag) return `[${tag}] ${text}`; otherwise return text."
---
## The contract line

A function's first line is a **contract**: what goes in, what comes out.
This lesson is about writing that contract in full — three signature
tools you'll use daily.

**Defaults.** A parameter with a fallback:

```ts
function formatPrice(cents: number, symbol: string = "$"): string {
  return symbol + (cents / 100).toFixed(2);
}
```

`formatPrice(1250)` → `"$12.50"`; `formatPrice(399, "€")` → `"€3.99"`.
(TypeScript could infer `string` from `"$"` — writing it out keeps the
contract readable at a glance.)

**Optional parameters.** A `?` marks a parameter callers may skip:

```ts
function tagLine(text: string, tag?: string): string {
```

Inside the function, `tag` is `string | undefined` — that vertical bar
is a *union*, lesson 4's whole topic. For now the practical move: check
`if (tag)` before using it. Optionals must come after required
parameters, and unlike a default there's no fallback value — just
possibly-nothing, which *you* handle.

**Object parameters.** Functions take objects constantly, and you can
spell out the shape inline:

```ts
function describeBook(book: { title: string; pages: number }): string {
  return `${book.title} (${book.pages} pages)`;
}
```

Members are separated by semicolons. Pass an object missing `pages`, or
with `pages: "lots"`, and `tsc` refuses the call — the contract does the
arguing so your function body doesn't have to. You can feel how noisy
inline shapes would get at three call sites, though. Naming shapes is
exactly the next lesson.

Remember the honesty rule from lesson 1: our runner strips these
annotations and runs the JS — the stdout check proves the *behavior*,
and the AI reviewer holds you to the *contract*.

### Your goal

1. `formatPrice(cents: number, symbol: string = "$"): string` — cents to
   a price string.
2. `describeBook(book: { title: string; pages: number }): string`.
3. `tagLine(text: string, tag?: string): string` — `[tag] text` when
   tagged, plain text otherwise.
4. Print these five calls: `formatPrice(1250)`, `formatPrice(399, "€")`,
   `describeBook({ title: "The Mythical Man-Month", pages: 322 })`,
   `tagLine("backup the server", "urgent")`, `tagLine("backup the
   server")`:

```
$12.50
€3.99
The Mythical Man-Month (322 pages)
[urgent] backup the server
backup the server
```
