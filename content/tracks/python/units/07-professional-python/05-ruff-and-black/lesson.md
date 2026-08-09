---
id: 05-ruff-and-black
title: Ruff and Black
language: python
runner: local
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
  - path: messy.py
    starter: starter/messy.py
goal: "Be the linter: implement check_source with ruff's E501, W291 and F401 rules, run it over messy.py, then clean messy.py — same behaviour, zero findings — until the report reads All checks passed!"
docs: [python/files, python/strings, python/modules-and-imports]
checks:
  - id: linter-catches-each-rule
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: repo-is-clean
    type: stdout
    entry: main.py
    match: exact
    value: "All checks passed!\n"
  - id: real-tooling-discipline
    type: ai-judge
    rubric: "check_source walks the source line by line with enumerate(..., start=1) and returns a list of strings shaped 'file:line: CODE message' — it never prints, and the findings are computed from the source rather than hardcoded for messy.py. E501 compares len(line) against the MAX_LINE constant (88, black's default) instead of a literal; W291 detects trailing whitespace by comparing the line to line.rstrip(); F401 pulls the imported name out of an 'import X' or 'from Y import X' line and reports it only when that name appears on no other line. main reads messy.py from disk, prints one line per finding, and prints ruff's 'All checks passed!' only when the list is empty. The cleaned messy.py keeps the same behaviour — summarize still returns the identical summary string — and was fixed by wrapping the long line and removing the unused import, not by deleting or shortening the logic."
hints:
  - "One pass, three independent ifs per line: len(line) > MAX_LINE, line != line.rstrip(), and the import test. A single line can produce more than one finding."
  - "For F401, strip the line first: stripped.startswith(\"import \") gives the name after 'import '; a 'from X import Y' line gives the part after ' import '. Then it's unused if no OTHER line contains that name — any(name in other for i, other in enumerate(lines, 1) if i != number) is False."
  - "Now fix messy.py: drop the import nothing uses, delete the trailing spaces, and split the long return across lines using implicit string concatenation inside parentheses — f\"...\" followed by f\"...\" on the next line joins with no separator, so the returned text is unchanged."
---
## Style, settled

Two arguments vanish from a professional Python repo on day one:
*how should this be formatted?* and *is this line a problem?*
A formatter and a linter answer them, and nobody debates it again.

**Black** is the formatter. It reads your file and rewrites it into one
canonical shape — 88-character lines, double quotes, its own bracket
wrapping. There is nothing to configure, which is the point: diffs stop
containing style noise.

```
$ black .
reformatted app/pricing.py
$ black --check --diff .    # what CI runs
```

**Ruff** is the linter (and, these days, a black-compatible formatter
too — `ruff format`). It reads your code for *problems*, each with a
code you can look up:

```
$ ruff check .
messy.py:1:1: F401 [*] `json` imported but unused
messy.py:5:25: W291 [*] Trailing whitespace
messy.py:8:89: E501 Line too long (111 > 88)
Found 3 errors.
[*] 3 fixable with the `--fix` option.
```

`ruff check --fix` applies the starred ones. Configuration lives in
`pyproject.toml`:

```toml
[tool.ruff]
line-length = 88
[tool.ruff.lint]
select = ["E", "F", "I"]   # pycodestyle, pyflakes, import sorting
```

A specific line you've decided is fine gets `# noqa: E501` — with a
reason. Teams run both in a pre-commit hook and again in CI, so
unformatted code simply can't merge.

You can't `pip install ruff` in this runner, so today you *are* the
linter: three of its real rules, implemented, then pointed at a file
that breaks all three.

### Your goal

1. `check_source(filename, source)` returns a list of findings shaped
   `messy.py:5: W291 trailing whitespace`:
   **E501** line longer than `MAX_LINE`, **W291** trailing whitespace,
   **F401** an imported name that appears on no other line.
2. `main()` reads `messy.py`, prints each finding, then
   `Found N error(s).` — or ruff's own line when there are none.
3. Clean `messy.py` until it prints:

```
All checks passed!
```

`summarize` must still return exactly the same string — the tests call
it. Fixing style is never a licence to change behaviour.
