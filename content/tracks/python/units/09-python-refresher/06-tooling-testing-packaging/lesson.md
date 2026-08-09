---
id: 06-tooling-testing-packaging
title: "Tooling, Testing, Packaging"
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Close the refresher with the professional toolbelt: slugify plus three pytest-style test_ functions, and run_tests() — pytest's discovery loop rebuilt in five lines, graded against an injected failure."
docs: [python/venv-and-pip, python/errors-and-exceptions, python/debugging]
checks:
  - id: toolbelt-holds-up
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "hello-world\n3 passed\n"
  - id: pytest-conventions
    type: ai-judge
    rubric: "slugify lowercases first and collapses every run of non-alphanumeric characters with a single re.sub using a negated character class ([^a-z0-9]+ or equivalent) then strips leading/trailing hyphens — no character-by-character loops. The three tests are bare zero-argument functions named test_lowercases, test_hyphenates, and test_strips_edges whose bodies are plain assert statements about slugify — no unittest classes, no self, no framework imports. run_tests discovers at CALL time by walking sorted(globals()) for callables whose names start with 'test_', invokes each inside try/except AssertionError, prints 'FAIL <name>' per failure, and ends with a computed summary — '<passed> passed' plus ', <failed> failed' only when something failed; the counts are tallied, never hardcoded, and no test function is called by its literal name. The drill lines at the bottom are intact."
hints:
  - "slugify is one line: re.sub(r\"[^a-z0-9]+\", \"-\", text.lower()).strip(\"-\") — lowercase first so the class can stay a-z."
  - "Each test is two lines: def test_lowercases(): assert slugify(\"HELLO\") == \"hello\" — bare functions, bare asserts, exactly like real pytest."
  - "Discovery: for name in sorted(globals()): fn = globals()[name] — act only if name.startswith(\"test_\") and callable(fn); try: fn(); passed += 1 / except AssertionError: print(f\"FAIL {name}\"); failed += 1."
---
## The toolbelt

Real projects lean on tools our runner can't ship, so this drill
rebuilds the one that matters most and recaps the rest.

**pytest** is convention, not ceremony: files named `test_*.py`,
functions named `test_*`, plain `assert`. `pytest -q` discovers and
runs them, rewriting failed asserts into readable diffs. Parametrize
kills copy-paste:

```python
@pytest.mark.parametrize("raw,slug", [("A B", "a-b"), ("hi!", "hi")])
def test_slugify(raw, slug):
    assert slugify(raw) == slug
```

**The rest of the belt**, one line each: `ruff check .` lints,
`ruff format .` formats, `mypy .` type-checks — all configured in
**pyproject.toml**, the same file that declares your package:

```toml
[project]
name = "slugger"
version = "0.1.0"
```

**Per-project isolation**: `python -m venv .venv`, activate, `pip
install -e .`; `pip freeze > requirements.txt` pins what you got.

Here you'll write real pytest-style tests, then implement discovery
yourself — five lines that demystify the tool.

### Your goal

1. `slugify(text)` — lowercase; every run of non-alphanumerics becomes
   one `-`; no leading/trailing hyphens.
2. Three pytest-style tests — `test_lowercases`, `test_hyphenates`,
   `test_strips_edges` — bare functions, bare asserts.
3. `run_tests()` — walk `sorted(globals())`, call every callable named
   `test_*`, catch `AssertionError`; print `FAIL <name>` per failure,
   then `<passed> passed` (plus `, <failed> failed` when red).

The drill prints exactly:

```
hello-world
3 passed
```

Our checks inject a failing test into your globals and expect
`FAIL test_zz_boom` and `3 passed, 1 failed` — discovery has to be
real.
