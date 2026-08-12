# Authoring a tutorial project

A **project** is one program the learner builds across several stages, keeping
their own code the whole way. A **lesson** is a single self-contained exercise.
Both are content — adding either one means adding files, never editing code.

Working example: `content/tracks/javascript/units/02-functions-arrays-objects/projects/snake/`.

## The folder

```
content/tracks/<track>/units/<unit>/projects/<project-id>/
├── project.md                  the brief + frontmatter
├── workspace/                  the files the learner starts with, ONCE
│   └── snake.js
└── stages/
    ├── 01-the-board/
    │   ├── stage.md            goal, checks, hints for this stage
    │   ├── tests.js            any check assets (optional)
    │   └── solution/           ONLY the files this stage changes
    │       └── snake.js
    └── 02-move-the-snake/
        └── …
```

Then list it in `content/tracks/<track>/track.json`, beside `lessons`:

```json
{ "id": "02-functions-arrays-objects", "…": "…", "projects": ["snake"] }
```

Nothing is discovered by scanning the filesystem — a folder that isn't listed
in the manifest is invisible. That is deliberate: it means half-finished
content can sit in the tree without appearing in the app.

## project.md

```yaml
---
id: snake                # must match the folder name
title: Build Snake
language: javascript     # one language for the whole project
runner: browser          # browser | local
entry: snake.js          # the file the runners execute — never guessed
summary: One line, shown in listings.
workspace: workspace     # folder holding the starting files (default: "workspace")
stages: [01-the-board, 02-move-the-snake, 03-eat-and-grow]   # order matters
estMinutes: 50
---
Markdown brief goes here: what they're building and why.
```

`language`, `runner` and `entry` live on the project, not the stage. A stage
that changed language would be a different workspace, which is a different
project.

## stage.md

```yaml
---
id: 01-the-board         # must match the folder name
title: The board
goal: One sentence describing what this stage asks for.
estMinutes: 15
docs: [javascript/arrays]
checks:
  - id: board-and-render
    type: tests
    entry: snake.js
    testFile: tests.js
hints:
  - "Escalating: concept, then location, then near-answer."
---
Markdown teaching this stage.
```

Stage frontmatter is exactly the "unit of work" half of a lesson — goal, docs,
checks, hints, timing — and it's validated by the same zod schema, so the two
kinds can never drift into having different check rules.

## The two rules that matter

**Stage solutions are deltas.** Put only the files that stage changes in its
`solution/`. The loader layers them in order, so stage 3's starting workspace is
the seed plus stage 1's and stage 2's solutions. You never copy a file forward
by hand — that's what today's capstone *lessons* do, and it's what this format
exists to stop.

**A stage must ask for real work.** `npm run lint-content` runs each stage's
checks against the workspace *before* that stage's solution is applied, and
fails the build if they all already pass. A stage nobody has to do is a stage
that shouldn't exist.

At least one check must fail, not all of them — a stage may legitimately
re-assert an earlier invariant as a regression guard, and those are supposed to
keep passing. Snake's stage 2 and 3 both end with one.

## What the gate proves

`npm run lint-content` walks every stage in order and, for each:

1. runs its checks on the pre-stage workspace — at least one must **fail**
2. layers that stage's solution on
3. runs its checks again — all must **pass**
4. carries the merged workspace into the next stage

So a green gate means the project is completable start to finish by someone
following it, not just that each stage compiles.

## Choosing what to build

Pick something whose state is **data**, not pixels. jsdom does no layout and has
no canvas — `getContext('2d')` returns `null` — so a canvas game can only carry
`ai-judge` checks, and those never block completion by design. That gives you a
project with no real gate.

What checks well:

- **Pure logic behind a game or tool** — Snake's board, movement and scoring are
  all plain functions over arrays. `tests` checks, and they're honest ones.
- **Text programs** — `stdout` checks take an optional `stdin` fixture, so a
  program that reads input can be driven with scripted keystrokes.
- **DOM structure** — `dom` checks assert real elements and cascade-correct CSS,
  just not where anything ended up on screen.

Build the logic as testable functions, then let presentation be the easy part
the learner adds at the end. That's better engineering advice as well as better
lesson design.
