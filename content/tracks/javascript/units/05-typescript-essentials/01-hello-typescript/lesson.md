---
id: 01-hello-typescript
title: Hello, TypeScript
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Annotate learner and streak, write describeStreak(name: string, days: number): string, and print the streak line plus the motto — your first .ts file."
docs: [javascript/typescript-basics, javascript/variables-and-types]
checks:
  - id: prints-both-lines
    type: stdout
    entry: main.ts
    match: exact
    value: "Ada has a 12-day streak\nTypeScript is JavaScript with types\n"
  - id: real-annotations
    type: ai-judge
    rubric: "learner carries an explicit : string annotation and streak an explicit : number. describeStreak annotates both parameters (name: string, days: number) and its string return type, and builds its result from the parameters (template literal or concatenation) — the streak line is printed by calling it, not typed as a literal. motto is left unannotated."
hints:
  - "The annotation sits between the name and the =: const learner: string = \"Ada\";"
  - "function describeStreak(name: string, days: number): string { ... } — the return type comes after the parameter list's closing paren."
  - "Return `${name} has a ${days}-day streak`, then console.log(describeStreak(learner, streak)); console.log(motto);"
---
## JavaScript with a safety net

Welcome to TypeScript. Here's the secret that makes it learnable in an
afternoon: **TypeScript is JavaScript**. Every line you've written in
this track is already valid TS. What TypeScript adds is a way to *write
down your intentions* — annotations saying what type each thing is:

```ts
const streak: number = 12;

function describeStreak(name: string, days: number): string {
  return `${name} has a ${days}-day streak`;
}
```

Read `name: string` as "name is a string". The annotation after the
parentheses is the **return type** — a promise to hand back a string.
Call `describeStreak(12, "Ada")` in a real editor and it's underlined
in red before you ever run it.

One honest note about *this* course, because it matters: our runner uses
Node's **type stripping** — it erases the annotations and runs the plain
JavaScript underneath. Types are never checked at runtime. In a real
project, the **`tsc` compiler and your editor** check types *before* the
code runs — that's where the red squiggles come from. Here, the
deterministic checks verify your program's behavior, and an AI reviewer
reads your annotations the way a human code reviewer would. Same skills,
two graders.

(Stripping also means we write *erasable* TypeScript — annotations you
could delete and leave working JS. That's modern TS style anyway; older
constructs like `enum` don't make the cut, and we'll skip them.)

You also don't annotate everything. `const motto = "..."` — TypeScript
**infers** string on its own. Professionals annotate the boundaries
(parameters, returns) and let inference handle the middles. Today you'll
annotate a little more than usual, to get the syntax into your fingers.

Your file is `main.ts` now. That extension is the whole ceremony.

### Your goal

1. Annotate `learner` (`: string`) and `streak` (`: number`).
2. Write `describeStreak(name: string, days: number): string` returning
   `` `${name} has a ${days}-day streak` ``.
3. Leave `motto` unannotated — inference has it covered.
4. Print the streak line, then `motto`:

```
Ada has a 12-day streak
TypeScript is JavaScript with types
```
