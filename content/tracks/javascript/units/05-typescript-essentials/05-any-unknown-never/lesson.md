---
id: 05-any-unknown-never
title: "any, unknown, never"
language: javascript
runner: local
estMinutes: 18
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Tame JSON.parse with unknown: write describeValue(value: unknown) that narrows before touching anything, a fail(message): never that throws, and requireString built from both."
docs: [javascript/typescript-basics, javascript/conditionals]
checks:
  - id: describes-parsed-json
    type: stdout
    entry: main.ts
    match: exact
    value: "string of length 5\nnumber 42\nboolean true\nmystery value\nQUIET\n"
  - id: unknown-not-any
    type: ai-judge
    rubric: "describeValue and requireString both type their parameter as unknown (not any), and every property access happens only after a typeof narrowing check — value.length appears only inside the string branch. fail(message: string) declares an explicit never return type and throws. requireString returns the narrowed string or calls fail (not a rewritten throw). The finished file contains no : any annotations and no as casts used to skip narrowing."
hints:
  - "describeValue chains typeof checks: if (typeof value === \"string\") return `string of length ${value.length}`; — inside that branch, .length is legal."
  - "function fail(message: string): never { throw new Error(message); } — never means it doesn't return at all."
  - "requireString: if (typeof value === \"string\") return value; then fail(`expected a string, got ${typeof value}`); — TypeScript knows fail ends the story."
---
## The escape hatches, ranked

Three special types sit at the edges of TypeScript. Knowing which to
reach for is a professional tell.

**`any` — the off switch.** A value typed `any` can do anything:
`x.foo.bar()`, no complaints, no checking. It's also contagious —
everything an `any` touches becomes `any`. And it leaks in from real
places: `JSON.parse` returns `any`, because the compiler can't know
what's inside a string at runtime. An `any` from a parse can crash five
files away. Avoid writing it; contain it when an API hands it to you.

**`unknown` — the locked box.** Also "could be anything", but flipped:
you can't touch it *until you prove what it is* — with the narrowing you
learned last lesson:

```ts
function describeValue(value: unknown): string {
  if (typeof value === "string") return `string of length ${value.length}`;
  ...
}
```

Outside a check, `value.length` is a compile error; inside the `string`
branch it's fine. So the professional JSON move is one line:

```ts
const data: unknown = JSON.parse(text);
```

Same runtime value — but now every use must earn its access. The `any`
stops at the boundary.

**`never` — the impossible type.** No value can ever be a `never`. Its
first job: the return type of a function that *never returns*:

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

Because `fail` is declared `never`, TypeScript knows any code after a
`fail(...)` call is unreachable — so a function can end with it instead
of a `return` and still satisfy its contract. (Its second job —
proving a `switch` handled every case — headlines the capstone.)

The ladder, top to bottom: precise types, then `unknown` when you
genuinely don't know yet, and `any` almost never.

### Your goal

1. `describeValue(value: unknown): string` — `typeof` chains to:
   `` `string of length ${...}` ``, `` `number ${...}` ``,
   `` `boolean ${...}` ``, else `"mystery value"`.
2. `fail(message: string): never` — throws an `Error`.
3. `requireString(value: unknown): string` — returns the string, or
   calls `` fail(`expected a string, got ${typeof value}`) ``.
4. Uncomment the starter's five prints:

```
string of length 5
number 42
boolean true
mystery value
QUIET
```
