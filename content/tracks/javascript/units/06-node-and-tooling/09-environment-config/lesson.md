---
id: 09-environment-config
title: Environment Config
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
  - path: .env
    starter: starter/.env
goal: "Build the config loader every deployed app contains: parse a real .env file line by line, then merge defaults, file values, and the process environment so that each layer overrides the one below."
docs: [javascript/objects, javascript/strings, javascript/npm-basics]
checks:
  - id: parser-and-precedence
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: resolved-config
    type: stdout
    entry: main.js
    match: exact
    value: "mode: dev\nport: 4000\napi: https://api.example.com\n"
  - id: layered-not-hardcoded
    type: ai-judge
    rubric: "parseEnv(text) is a real line parser: split on newlines, trim, skip blank lines and lines starting with #, split each remaining line on the FIRST = only (indexOf/slice or an equivalent — 'TOKEN=a=b' must keep 'a=b' intact), building a plain object of string values. resolveConfig(defaults, fileVars, realEnv) merges with spreads (or equivalent) in exactly that order so realEnv beats fileVars beats defaults. The .env file is genuinely read from disk with readFileSync and fed through parseEnv; the printed mode/port/api lines interpolate the RESOLVED config object — the strings dev, 4000, and https://api.example.com never appear as literals in main.js. The run call passes an empty object as realEnv (with process.env named as what a real app would pass)."
hints:
  - "parseEnv skeleton: for each line — trim it; skip \"\" and startsWith(\"#\"); const eq = line.indexOf(\"=\"); vars[line.slice(0, eq)] = line.slice(eq + 1); — indexOf finds the FIRST =, so values may contain more."
  - "resolveConfig is one line: return { ...defaults, ...fileVars, ...realEnv }; — in a spread, later keys overwrite earlier ones. Spread order IS the precedence rule."
  - "The run: const config = resolveConfig(DEFAULTS, parseEnv(readFileSync(\".env\", \"utf8\")), {}); — the {} stands where a real app passes process.env, and keeps this run reproducible on any machine."
---
## Config lives in the environment

Your app needs a port, an API base URL, a mode. Hardcode them and every
deploy means editing source; commit an API key and it's public forever
(bots scrape GitHub for exactly that). The professional rule — canonized
in the "twelve-factor app" — is that **config lives in the environment,
not in code**. Node reads it from `process.env`, a plain object where
every value is a *string*: `process.env.PORT` is `"4000"`, never
`4000`.

Setting real environment variables per-terminal is a chore, so teams
keep a **`.env` file** next to the project — `KEY=value` lines, `#`
comments — loaded at startup and **listed in `.gitignore`**, because
that's where secrets go. The famous `dotenv` package does the loading
(`import "dotenv/config"`), and Node now has it built in:
`node --env-file=.env main.js`. Under the hood, both do exactly what
you'll write today: parse lines, build an object.

The part that separates seniors from juniors is **precedence**. Three
layers, each overriding the one below:

1. **defaults** in code — the app runs with zero setup;
2. **`.env` file** — this machine's local overrides;
3. **the real environment** — always wins, so an operator can hotfix
   production (`PORT=80`) without touching a single file.

And the implementation is a one-liner you already own — spread order:

```js
{ ...defaults, ...fileVars, ...realEnv }
```

Later spreads overwrite earlier keys. The merge *is* the policy.

Your lesson folder contains a real `.env` (the runner is local — read
it with `readFileSync`). `resolveConfig` takes `realEnv` as a
parameter, and today's run passes `{}` — the reproducible stand-in for
`process.env`, which varies by machine; the tests pass fake
environments to prove the layering. Dependencies at the edge, one last
time — that's been this whole unit.

### Your goal

1. `parseEnv(text)` — `KEY=value` lines to an object; skip blanks and
   `#` comments; split on the *first* `=` only.
2. `resolveConfig(defaults, fileVars, realEnv)` — the three-layer
   spread merge.
3. Resolve the starter's `DEFAULTS` against the parsed `.env` and `{}`,
   then print from the result:

```
mode: dev
port: 4000
api: https://api.example.com
```
