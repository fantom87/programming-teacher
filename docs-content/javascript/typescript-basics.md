# TypeScript basics

**TypeScript** is JavaScript plus type annotations. You write mostly normal JavaScript, but you can label what type each value should be — and a checker catches mismatches *before* the code runs.

```ts
let score: number = 10;
score = "ten";   // Error: Type 'string' is not assignable to type 'number'
```

That red squiggle in your editor is TypeScript saving you from a runtime bug.

## Type inference: you write less than you think

TypeScript usually figures types out on its own:

```ts
let city = "Lisbon";   // inferred as string — no annotation needed
city = 42;             // Error!
```

Annotate where inference can't see: function parameters and (often) return values.

```ts
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);       // 5
add(2, "3");     // Error caught at compile time
```

## The basic types

```ts
const name: string = "Ada";
const age: number = 36;
const active: boolean = true;
const tags: string[] = ["js", "ts"];        // array of strings
const anything: unknown = getData();        // "unknown" forces you to check first
```

Avoid `any` — it switches the checker off for that value.

## Describing objects with interfaces

```ts
interface User {
  name: string;
  age: number;
  email?: string;   // ? means optional
}

function greet(user: User): string {
  return `Hi, ${user.name}!`;
}

greet({ name: "Ada", age: 36 });            // works
greet({ name: "Ada" });                     // Error: age is missing
```

## Union types: "this OR that"

```ts
let id: string | number;
id = 7;        // fine
id = "abc";    // fine
id = true;     // Error

type Status = "loading" | "success" | "error";   // only these exact strings
```

## Running TypeScript

Browsers only speak JavaScript, so TypeScript is *compiled* (translated) first:

```bash
npm install --save-dev typescript
npx tsc --init        # creates tsconfig.json
npx tsc               # compiles .ts files to .js
```

Most projects use a tool like Vite that handles this automatically. Start small: add types to function parameters, let inference do the rest, and enjoy the editor autocomplete.
