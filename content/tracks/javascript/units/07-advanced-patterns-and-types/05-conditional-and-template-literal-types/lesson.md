---
id: 05-conditional-and-template-literal-types
title: Conditional and Template Literal Types
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Make the type system compute: a template-literal Endpoint type stamped out of a route union, and an Unwrap<T> conditional type that uses infer to pull the payload out of any Promise."
docs: [javascript/typescript-basics, javascript/strings, javascript/async-and-promises]
checks:
  - id: computed-types-run
    type: stdout
    entry: main.ts
    match: exact
    value: "/api/songs\n/api/artists\n42\nalready plain\n"
  - id: type-level-computation
    type: ai-judge
    rubric: "Resource is a union of the string literals \"songs\" and \"artists\", and Endpoint is the TEMPLATE LITERAL type `/api/${Resource}` — deriving both paths from the union, not a hand-listed union of two path strings. endpoint(resource: Resource): Endpoint builds its return value with a template expression interpolating the parameter (not an if/else over hardcoded paths). Unwrap<T> is a conditional type of the shape T extends Promise<infer U> ? U : T — the true branch must surface the inferred U and the false branch must fall back to T. cached is annotated with Unwrap applied to a Promise-of-number type (via ReturnType<typeof loadPlayCount> or Promise<number> directly) and used in arithmetic that prints 42; plain is annotated Unwrap<string> (the false branch) and prints. No any, no as-casts to dodge the conditional, and every printed line flows from these declarations."
hints:
  - "Template literal types distribute over unions: type Endpoint = `/api/${Resource}`; produces \"/api/songs\" | \"/api/artists\" — two members from one line."
  - "The conditional reads like a ternary: type Unwrap<T> = T extends Promise<infer U> ? U : T; — infer U names 'whatever the Promise wraps' so the true branch can return it."
  - "Apply it to a real function: const cached: Unwrap<ReturnType<typeof loadPlayCount>> = 41; — ReturnType gives Promise<number>, your Unwrap strips the Promise, and only number survives the annotation."
---
## The type system is a language

You've written types that *describe* values. TypeScript's endgame is
types that *compute* — and two features carry most of that weight in
real codebases.

**Template literal types** are string interpolation at type level:

```ts
type Resource = "songs" | "artists";
type Endpoint = `/api/${Resource}`;   // "/api/songs" | "/api/artists"
```

The template **distributes over the union** — every member gets
stamped through the pattern. Add `"albums"` to `Resource` and a third
endpoint exists everywhere, instantly; typo `"/api/song"` somewhere and
it's a compile error. This is how libraries type event names
(`` `on${Capitalize<string & K>}` ``) and route tables without a
maintenance burden.

**Conditional types** are the if/else:

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

Read it as a ternary: *if `T` is a promise of something, call that
something `U` and produce it; otherwise produce `T` unchanged.* The
`infer` keyword is the magic — it names a type the compiler has to
figure out from the match, like a capture group in a regex. So
`Unwrap<Promise<number>>` computes to `number`, and `Unwrap<string>`
falls through to `string`. You already use conditionals daily without
noticing: `ReturnType`, `Awaited`, and `Parameters` are all
`infer`-powered conditionals from the standard library.

Runtime code can't *see* any of this — the runner strips it all, as
always — but the wiring is checkable: annotate a value with a computed
type and the program only makes sense if the computation landed where
you claimed. That's exactly how your demo is built.

### Your goal

1. `Resource` (`"songs" | "artists"`) and the template-literal
   `Endpoint` type; then `endpoint(resource: Resource): Endpoint`
   returning `` `/api/${resource}` ``. Print both endpoints.
2. `Unwrap<T>` as above, plus
   `async function loadPlayCount(): Promise<number>` returning `41`.
3. `const cached: Unwrap<ReturnType<typeof loadPlayCount>> = 41;` —
   print `cached + 1`.
4. `const plain: Unwrap<string> = "already plain";` — the false branch —
   print it.

```
/api/songs
/api/artists
42
already plain
```
