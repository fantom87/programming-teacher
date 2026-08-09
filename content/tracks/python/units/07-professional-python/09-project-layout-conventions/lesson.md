---
id: 09-project-layout-conventions
title: Project Layout Conventions
language: python
runner: browser
estMinutes: 22
files:
  - path: main.py
    starter: starter/main.py
goal: "Audit a flat pile of files against the src layout: relocate() decides where each one belongs, missing() names the scaffolding that isn't there, and plan() prints the whole migration — move, keep, add — with counts."
docs: [python/modules-and-imports, python/venv-and-pip, python/files]
checks:
  - id: audit-rules-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: migration-plan
    type: stdout
    entry: main.py
    match: exact
    value: "move cli.py -> src/slugkit/cli.py\nmove core.py -> src/slugkit/core.py\nmove test_core.py -> tests/test_core.py\nkeep notes.txt\nkeep README.md\nadd pyproject.toml\nadd .gitignore\nadd src/slugkit/__init__.py\n5 placed, 3 to add\n"
  - id: real-layout-discipline
    type: ai-judge
    rubric: "relocate encodes the conventions as rules rather than a lookup table of the five proposed filenames: a path that already contains a slash is returned unchanged, a non-.py file stays at the repository root, conftest.py and any test_*.py module goes to tests/, and every other module goes to src/<PACKAGE>/ built from the PACKAGE constant — the string 'slugkit' is never typed inside relocate. missing() derives the placed set by relocating every proposed path and returns the absent REQUIRED entries in the order that constant lists them, so a project that already ships a README is not told to add one. plan() prints 'move a -> b' only when relocate actually changes the path and 'keep a' otherwise, then one 'add' line per gap, then a summary whose two numbers come from len(paths) and len(missing(paths)) — neither 5 nor 3 appears as a literal. PROPOSED, PACKAGE and REQUIRED are unmodified."
hints:
  - "Order the rules from most specific to least: an existing slash means the file is already placed; anything that isn't .py stays at the root; conftest.py and test_*.py go to tests/; everything else is package source."
  - "missing() needs the tree as it will be, not as it is: placed = {relocate(p) for p in paths}, then [item for item in REQUIRED if item not in placed]."
  - "plan() decides move-or-keep by comparing: target = relocate(path), then print f\"move {path} -> {target}\" when they differ and f\"keep {path}\" when they don't. Finish with f\"{len(paths)} placed, {len(gaps)} to add\"."
---
## Where things live

Open a professional Python repository and the shape is always the same:

```
slugkit/
├── src/
│   └── slugkit/
│       ├── __init__.py
│       ├── cli.py
│       └── core.py
├── tests/
│   ├── conftest.py
│   └── test_core.py
├── pyproject.toml
├── README.md
└── .gitignore
```

That extra `src/` looks like bureaucracy and isn't. Python puts the
current directory on `sys.path`, so in a **flat** layout `import
slugkit` finds the folder sitting right there — your tests pass against
source you never installed, and the day a packaging bug ships an empty
wheel, nothing catches it. Under **src layout**, the repo root holds no
importable package at all. After `pip install -e .`, `import slugkit`
resolves to the *installed* one — the same thing your users get. The
bug class disappears.

`__init__.py` is what makes a directory a package (and where you choose
the public names). `tests/` sits *beside* the package, never inside it:
tests aren't something you ship. `conftest.py` is pytest's shared
setup — fixtures defined there are visible to every test file in that
directory tree, with no import.

Then the root files that make a repo legible: `pyproject.toml`
(identity and tooling, from last lesson), `README.md`, `.gitignore`,
usually a `LICENSE`. A newcomer can orient themselves in ten seconds
because the conventions are *conventions* — nothing here is your taste.

Today you'll be the reviewer on a project that grew flat, and produce
the migration plan.

### Your goal

1. `relocate(path)` — where a file belongs: already-placed paths (any
   with a `/`) unchanged, non-`.py` files at the root, `conftest.py`
   and `test_*.py` under `tests/`, every other module under
   `src/<PACKAGE>/`.
2. `missing(paths)` — the `REQUIRED` entries no relocated path
   provides, in order.
3. `plan(paths)` — the migration, then the tally:

```
move cli.py -> src/slugkit/cli.py
move core.py -> src/slugkit/core.py
move test_core.py -> tests/test_core.py
keep notes.txt
keep README.md
add pyproject.toml
add .gitignore
add src/slugkit/__init__.py
5 placed, 3 to add
```
