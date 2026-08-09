---
id: 07-tsconfig-basics
title: tsconfig Basics
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.ts
    starter: starter/main.ts
  - path: tsconfig.json
    starter: starter/tsconfig.json
goal: "Model tsconfig.json with a pair of interfaces, read and parse the real file from disk, and print a five-line report of what the compiler would do — every value from the parsed object."
docs: [javascript/typescript-basics, javascript/npm-basics]
checks:
  - id: config-report
    type: stdout
    entry: main.ts
    match: exact
    value: "tsconfig report\ntarget: es2022\nstrict mode: on\noutput folder: dist\n2 folders included\n"
  - id: typed-at-the-boundary
    type: ai-judge
    rubric: "Interfaces CompilerOptions (target: string, strict: boolean, outDir: string) and TsConfig (compilerOptions plus include: string[]) model the JSON, and the parse result is given that type (as TsConfig or an annotation). The report is computed from the parsed object: target and outDir interpolated from it, \"on\"/\"off\" chosen by a conditional on the strict boolean, and the folder count from include.length — the strings \"es2022\", \"dist\", and the count 2 never appear as output literals. The file is read with node:fs readFileSync, not pasted into main.ts."
hints:
  - "interface CompilerOptions { target: string; strict: boolean; outDir: string } — then interface TsConfig { compilerOptions: CompilerOptions; include: string[] }."
  - "const config = JSON.parse(raw) as TsConfig; — the as assertion is your promise about a file in your own repo."
  - "strict line: `strict mode: ${options.strict ? \"on\" : \"off\"}` — and the last line is `${config.include.length} folders included`."
---
## The control panel our runner skips

Since lesson 1 you've known the honest truth: our runner strips types
and runs the JS. The tool that *does* check them is **`tsc`**, the
TypeScript compiler — and its control panel is a file named
**`tsconfig.json`** at the root of every real TS project. Your editor
reads it too; it's how VS Code knows which red squiggles to draw.

Four settings cover most of what you'll meet:

- **`strict`** — the non-negotiable. One switch that turns on a family
  of checks (no implicit `any`, null-safety, more). New projects turn it
  on; keep it on.
- **`target`** — which era of JavaScript to emit, e.g. `"es2022"`.
- **`outDir`** — where compiled `.js` files land, e.g. `"dist"`.
- **`include`** — which folders tsc should look at.

And the command that ties this unit together: `npx tsc --noEmit` —
*check the types, emit nothing*. That's the exact step our runner skips,
and what CI runs on every real TypeScript repo before code merges.

Today's exercise makes the file concrete: your lesson folder contains a
real `tsconfig.json`, and your program reads it off disk (the runner is
local — this is genuine file I/O) and reports what the compiler would
do. It's also a rematch with lesson 5: `JSON.parse` returns `any`. Last
time you tamed it with `unknown` and runtime checks. For a config file
*in your own repo*, pros usually reach for the middle ground — model the
shape with interfaces, then assert it:

```ts
const config = JSON.parse(raw) as TsConfig;
```

`as` is you overruling inference: "trust me, it has this shape." Earned
here; suspicious when it's used to silence errors on data you *don't*
control. One caveat for your own projects: real tsconfig files may
contain `//` comments (tsc tolerates them), but strict `JSON.parse`
doesn't — ours stays comment-free.

### Your goal

1. Declare `interface CompilerOptions` (`target: string`,
   `strict: boolean`, `outDir: string`) and `interface TsConfig`
   (`compilerOptions: CompilerOptions`, `include: string[]`).
2. Read `tsconfig.json` with `readFileSync`, parse, and assert
   `as TsConfig`.
3. Print the report — every value computed from the parsed object,
   `on`/`off` from the boolean, the count from `include.length`:

```
tsconfig report
target: es2022
strict mode: on
output folder: dist
2 folders included
```
