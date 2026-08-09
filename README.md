# Programming Teacher

A local app that teaches programming, with an AI tutor whose helpfulness you control.

Eight language tracks, 357 lessons, a five-level assistance slider that takes the
tutor from "type exactly this" to "here's the goal, I'll only check your work" —
and, importantly, **completion you can trust**: a lesson is done when its checks
actually pass, verified server-side, not when the model says so.

Built for one learner on one machine. Not a product, not hosted anywhere.

---

## Try it

Grab **`Programming.Teacher.1.0.0.zip`** (135 MB) from the
[Releases](../../releases/latest) page, extract it, and run
**Programming Teacher.exe** inside. It's ready in about five seconds.

There's a **`.exe` installer** on the same page if you'd rather have Start Menu
and desktop shortcuts. Same app; it just keeps your progress in the usual
per-user location instead of inside the app folder.

There is nothing to install — not even Node. The app carries its own runtime,
its own server, all 357 lessons and the whole docs library. It writes progress,
snapshots and logs to a `data` folder **beside the exe**, so the app is exactly
one folder: copy it to a USB stick, move it, or delete it and nothing is left
behind. Extracting a newer zip over the old folder keeps your progress.

**Windows only, for now.** macOS and Linux work fine from source (below); they
just don't have a packaged build yet.

**What works with nothing else installed:** 250 of the 357 lessons run entirely
in the app — SQL (86), Python via Pyodide (60), HTML/CSS (62) and JavaScript
(42) — along with their checks, progress tracking, the 127-page docs library
and the playground. The other 107 lessons (C# 63, plus the Node and CPython
lessons) shell out to real toolchains, and the app tells you the install command
when one is missing.

**What needs your own Claude Code:** the AI tutor and the AI-judged checks, and
only those. See below — everything else is untouched by it.

---

## What makes it different

**Every lesson is proven solvable.** `npm run lint-content` walks all 357
lessons, executes each one's reference solution, and grades it with that
lesson's own checks. Content ships only when the gate is green. It's the same
machinery that grades the learner — so "verified" means *executed*, not
*reviewed*.

**The tutor can't fake progress.** It has tools to run code, check goals, and
mark a lesson complete — but `mark_complete` re-runs the checks server-side and
refuses if they don't pass. No amount of "please just mark it done" works.

**Assistance is a policy, not a prompt tweak.** Five levels, switchable
mid-conversation. Level 1 reports pass/fail and nothing else; level 5 dictates
every keystroke and explains each token. The reference solution enters the
tutor's context only at level 3+, and crossing that line rebuilds the session.

**Four ways to check work, chosen per lesson:** program output (byte-exact),
assertion tests (a nonce-protected harness learner code can't forge), DOM
assertions for HTML/CSS (jsdom, cascade-correct), and AI-judged rubrics for
things like "did you use a loop rather than copy-pasting". An AI check that
can't be reached — offline, auth down — never blocks completion.

**Code runs two ways.** In-app for instant feedback (JavaScript in a worker,
Python via Pyodide, SQL via sql.js, HTML in a live iframe) and on real local
toolchains when a lesson needs them (Python, Node, .NET, Go, Rust, PowerShell,
Bash). The SQL result formatter is shared between the two so expected output is
byte-identical either way.

## The AI tutor is optional

The app ships **no Anthropic binaries**. The tutor runs on the copy of Claude
Code *you* installed — the server finds it and points the Agent SDK at it — so
the download carries only the SDK's JavaScript. (That's also why it's 135 MB and
starts in five seconds instead of 290 MB and fifty.)

**Without it, everything still works** except three things: the tutor chat, the
AI-judged checks (they report "couldn't reach the tutor" and never block
completion), and the custom-lesson generator. All 357 lessons still open, run,
check and complete; progress, docs, playground and stats are untouched.

**To switch it on:** install [Claude Code](https://claude.com/product/claude-code),
run `claude setup-token`, and restart the app.

The server looks for it in this order — the first hit wins, and an explicit
path that doesn't exist is an error rather than a silent fallback:

1. `PT_CLAUDE_PATH` (env)
2. **Claude Code path** in Settings — for unusual installs
3. `claude` on `PATH`
4. the usual install locations: `~/.local/bin`, `%LOCALAPPDATA%\Programs\claude`,
   `/usr/local/bin`, `/opt/homebrew/bin`, and your npm global prefix

Settings shows which executable it found. `/api/health` distinguishes the two
ways this can be off — `not-installed` and `not-logged-in` — because they have
different fixes, and the UI says which one applies.

## Tracks

| Track | Lessons | Status |
|---|---|---|
| Python | 77 | complete (Foundations → Advanced + Refresher) |
| JavaScript / TypeScript | 69 | complete |
| HTML / CSS | 62 | complete |
| C# | 63 | complete |
| SQL | 86 | complete |
| Shell (PowerShell + Bash) | — | syllabus + docs only |
| Go | — | syllabus + docs only |
| Rust | — | syllabus + docs only |

Plus 127 reference doc pages, and a generator that writes a **custom lesson**
from a plain-English request ("I want to practice reversing strings") —
schema-validated and solution-executed before it's offered.

## Running it from source

Prerequisites: **Node 22+**, and your own **Claude Code** install for the tutor
(see above — everything else works without it). Python, .NET, Go, Rust, and Git
Bash are optional — only lessons that need them will ask, and the app tells you
the install command.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run start` instead serves the built
frontend from the API server on port 4517, which is what the desktop app does.

This is the path for macOS and Linux, and it's the one to use if you want to
read or change the code — the packaged build is just this server in an Electron
window.

The server binds to **127.0.0.1 only** and rejects requests whose Host header
isn't localhost. That's deliberate and load-bearing: `/api/run` executes
arbitrary code by design, so this must never be exposed to a network. **Don't
host this.**

## Building the desktop app

```bash
npm run app:dist
```

Builds the frontend, bundles the server to a single file, stages its dependency
closure, then produces three things in `app/dist`:

- **`Programming Teacher 1.0.0.zip`** — the shareable one folder, exe inside.
- **`Programming Teacher 1.0.0.exe`** — a one-click installer with Start Menu
  and desktop shortcuts, for a machine you actually use it on. It keeps your
  progress in the usual per-user location rather than beside the exe, because
  uninstalling (and upgrading, which uninstalls first) deletes the install
  folder. The app detects which of the two it is by looking for an uninstaller.
- **`Programming Teacher.lnk`** in the repo root, pointing at the unpacked build.

`npm run app:zip` re-zips an existing build without rebuilding it.

## Look at the code in a browser

**Code → Codespaces → Create codespace on master** builds a container with Node,
Python, .NET and Go and runs the app behind a forwarded port — no local install,
nothing to clean up afterwards. First boot takes a few minutes. Details, and the
one security default it deliberately relaxes, are in
[`.devcontainer/README.md`](.devcontainer/README.md). **Keep the forwarded port
Private** — port 5173 proxies to `/api/run`, which executes arbitrary code.

## Repo layout

```
content/      lesson.md + starter/ + solution/ (+ tests/) per lesson, per track
docs-content/ the reference library, markdown + per-section index.json
shared/       types, zod schemas, the check engine (imported by server AND web)
server/       Express API, runners, curriculum loader, tutor service
web/          React SPA: lesson workspace, docs, playground, stats
app/          Electron shell
scripts/      content lint, bundling, packaging, icon and shortcut generation
```

## Checks

```bash
npm test             # unit + integration (127)
npm run lint-content # execute every lesson solution against its own checks
npm run typecheck -w web
```

## If you're here to critique it

Most useful places to look:

- `shared/src/checkEngine.ts` — how work is graded; the harness hardening.
- `server/src/tutor/service.ts` + `prompts.ts` — session lifecycle, the five
  assistance policies, the tool guards.
- `server/src/runner/localRunner.ts` — process isolation, timeouts, Windows
  tree-kill, output caps.
- `content/tracks/python/units/01-first-steps/` — whether the teaching is any
  good, which is the part software can't verify.
- `docs/KNOWN-LIMITATIONS.md` — what's knowingly unfinished.

Notes go in [`FEEDBACK.md`](FEEDBACK.md) or an issue, whichever is less friction.

Honest caveats: it's Windows-first (paths, `taskkill`, PowerShell probes); the
lesson content has been verified mechanically but not yet reviewed for teaching
quality; and the three empty tracks are syllabus-only.
