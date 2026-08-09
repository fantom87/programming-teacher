---
id: 08-pyproject-and-packaging
title: pyproject and Packaging
language: python
runner: local
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
  - path: pyproject.toml
    starter: starter/pyproject.toml
goal: "Write a real pyproject.toml for slugkit — build backend, project metadata, pinned dependencies, a console script — then read it back with tomllib and print a metadata summary that names any missing field."
docs: [python/venv-and-pip, python/files, python/modules-and-imports]
checks:
  - id: manifest-and-reader-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: metadata-summary
    type: stdout
    entry: main.py
    match: exact
    value: "slugkit 0.3.0 (python >=3.11)\nturn any title into a URL slug\ndependencies: click>=8.1, rich>=13.0\nscripts: slugkit = slugkit.cli:main\nbuild backend: hatchling.build\nmetadata complete\n"
  - id: real-packaging-discipline
    type: ai-judge
    rubric: "pyproject.toml is a genuine manifest: a [build-system] table declaring requires = [\"hatchling\"] and build-backend = \"hatchling.build\", a [project] table carrying name, version, description, requires-python and a dependencies array of PEP 508 strings with lower bounds (\"click>=8.1\", \"rich>=13.0\"), and a [project.scripts] table mapping the command slugkit to the \"module:function\" target slugkit.cli:main. Nothing is faked in Python — the metadata lives in the TOML, not in main.py. load_pyproject reads the given path (never a hardcoded filename) and parses it with tomllib, opening in binary mode for tomllib.load or passing text to tomllib.loads. missing_fields returns the absent REQUIRED_FIELDS in the order that constant lists them, computed by iterating it rather than by a chain of ifs. describe prints the gaps and returns early when any field is missing, and otherwise builds every printed value out of the parsed tables — the name, version, description, joined dependencies, joined scripts and build backend are all read, never retyped as literals."
hints:
  - "TOML tables are the headers in brackets. [project] holds the metadata as key = \"value\" pairs; dependencies is an array of strings; [project.scripts] is its own table whose keys become terminal commands."
  - "Reading it is two lines: data = tomllib.loads(Path(path).read_text(encoding=\"utf-8\")) gives nested dicts — data[\"project\"][\"dependencies\"] is a real Python list."
  - "missing_fields is a comprehension over the constant: [field for field in REQUIRED_FIELDS if field not in project]. In describe, print f\"missing: {', '.join(missing)}\" and return before touching any of the fields that aren't there."
---
## The one file every project has

A Python project's identity lives in **`pyproject.toml`** at its root.
Not a script, not code — a declaration that packaging tools, editors,
linters and CI all read:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "slugkit"
version = "0.3.0"
description = "turn any title into a URL slug"
requires-python = ">=3.11"
dependencies = ["click>=8.1", "rich>=13.0"]

[project.scripts]
slugkit = "slugkit.cli:main"
```

`[build-system]` names the **backend** that turns your source into a
package — hatchling, setuptools, flit, poetry-core; you pick one and
forget it. `[project]` is the metadata PyPI shows: strictly only `name`
and `version` are required, but a package without a description,
`requires-python` and declared `dependencies` is one nobody can safely
install. Those dependency strings are the same syntax as
`requirements.txt`, except here they travel *with* the package, so
`pip install slugkit` pulls click and rich along.

`[project.scripts]` is the quiet star: it creates a real terminal
command. After install, typing `slugkit` runs `main()` in
`slugkit/cli.py`. That single line is the difference between a folder
of scripts and a tool.

Then the workflow:

```
$ pip install -e .      # editable: your source IS the installed package
$ python -m build       # produces dist/*.whl and dist/*.tar.gz
$ twine upload dist/*   # to PyPI, when you mean it
```

Your tools pile into the same file too — `[tool.ruff]`, `[tool.mypy]`,
`[tool.pytest.ini_options]`. One file, one source of truth.

Two habits go with it. Bump `version` deliberately, following semantic
versioning — patch for a fix, minor for a feature, major when you break
someone. And keep extras out of the base install: development-only
packages belong under `[project.optional-dependencies]`, so
`pip install slugkit[dev]` gets pytest while everyone else doesn't.

Reading a manifest is just as ordinary a task as writing one, and
`tomllib` has been in the standard library since 3.11 — so today you'll
do both.

### Your goal

The brief is in `pyproject.toml`'s comments.

1. Fill in all three tables so the manifest matches the brief exactly.
2. `load_pyproject(path)` — parse *the given path* with `tomllib`.
   `missing_fields(project)` — the absent `REQUIRED_FIELDS`, in order.
3. `describe(path)` — print `missing: ...` and stop when anything's
   absent; otherwise print the summary, every value read from the file:

```
slugkit 0.3.0 (python >=3.11)
turn any title into a URL slug
dependencies: click>=8.1, rich>=13.0
scripts: slugkit = slugkit.cli:main
build backend: hatchling.build
metadata complete
```
