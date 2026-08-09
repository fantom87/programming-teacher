# Programming Teacher

A local app that teaches programming, with an AI tutor whose helpfulness you control.

Eight language tracks, 357 lessons, a five-level assistance slider that takes the
tutor from "type exactly this" to "here's the goal, I'll only check your work" —
and, importantly, **completion you can trust**: a lesson is done when its checks
actually pass, verified server-side, not when the model says so.

Built for one learner on one machine. Not a product, not hosted anywhere.

---

## Take a look in your browser

Nothing to install, nothing to uninstall afterwards:

1. **Code → Codespaces → Create codespace on master**, at the top of this repo.
2. Wait. First boot takes a few minutes — it builds a container with Node,
   Python, .NET and Go, then runs `npm install`.
3. A browser tab opens on the running app. If it opened before the server was
   ready, refresh it; if it never opened, use the **Ports** panel and click the
   globe beside **Programming Teacher (5173)**.

**What works immediately, with no account and no setup:** 250 of the 357
lessons run entirely inside your browser — SQL (86), Python via Pyodide (60),
HTML/CSS (62) and JavaScript (42). So do their checks, the progress tracking,
the 127-page docs library and the playground. The remaining 107 lessons (C# 63,
plus the Node and CPython lessons in the JavaScript and Python tracks) shell out
to real toolchains, which the container installs for you.

**What needs your own Claude Code login:** the AI tutor and the AI-judged
checks, and only those. Everything else — running code, the three non-AI check
types, marking lessons complete — is untouched by it. To switch the tutor on,
in the Codespace terminal:

```bash
npm install -g @anthropic-ai/claude-code
claude setup-token          # follow the link it prints
bash .devcontainer/start-dev.sh restart
```

Setting `ANTHROPIC_API_KEY` in the Codespace's secrets works too. Settings will
then report `using your Claude Code login`.

**Keep the forwarded port Private.** That's the default, and it matters: port
5173 proxies to `/api/run`, which executes arbitrary code by design. Setting the
port's visibility to Public would put that on the open internet for anyone with
the URL.

**Caveats.** Rust isn't installed in the container — it would add about a
gigabyte to the boot, and the Rust track has no lessons yet, so only the
playground's Rust tab is affected. The container is Linux while the app is
developed on Windows, so the local-toolchain lessons are the likeliest place to
find rough edges. And a codespace is a disposable machine: `data/` holds your
progress, and it goes away when you delete the codespace.

Details of how the container is wired, and the one security default it
deliberately relaxes, are in [`.devcontainer/README.md`](.devcontainer/README.md).

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

**Code runs two ways.** In-browser for instant feedback (JavaScript in a
worker, Python via Pyodide, SQL via sql.js, HTML in a live iframe) and on real
local toolchains when a lesson needs them (Python, Node, .NET, Go, Rust,
PowerShell, Bash). The SQL result formatter is shared between browser and
server so expected output is byte-identical either way.

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

## Running it

Prerequisites: **Node 22+**, and a **Claude Code** login for the tutor
(everything except the tutor and AI-judged checks works without it). Python,
.NET, Go, Rust, and Git Bash are optional — only lessons that need them will
ask, and the app tells you the install command.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. For the desktop build:

```bash
npm run app:dist
```

...which produces an installer and a shortcut. The desktop shell just starts
the local server and hosts the app in its own window.

The server binds to **127.0.0.1 only** and rejects requests whose Host header
isn't localhost. That's deliberate and load-bearing: `/api/run` executes
arbitrary code by design, so this must never be exposed to a network. **Don't
host this.**

## Repo layout

```
content/      lesson.md + starter/ + solution/ (+ tests/) per lesson, per track
docs-content/ the reference library, markdown + per-section index.json
shared/       types, zod schemas, the check engine (imported by server AND web)
server/       Express API, runners, curriculum loader, tutor service
web/          React SPA: lesson workspace, docs, playground, stats
app/          Electron shell
scripts/      content lint, asset copying, icon and shortcut generation
```

## Checks

```bash
npm test            # unit + integration (81)
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

Honest caveats: it's Windows-first (paths, `taskkill`, PowerShell probes);
the lesson content has been verified mechanically but not yet reviewed for
teaching quality; and the three empty tracks are syllabus-only.
