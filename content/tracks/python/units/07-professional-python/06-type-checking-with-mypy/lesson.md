---
id: 06-type-checking-with-mypy
title: Type Checking with mypy
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Annotate four functions the way mypy expects — including -> None and str | None — then write typecheck(fn, args) using get_type_hints and inspect.signature, and print mypy's own arg-type report over the call table."
docs: [python/functions, python/variables-and-types, python/errors-and-exceptions]
checks:
  - id: annotations-and-checker-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: mypy-style-report
    type: stdout
    entry: main.py
    match: exact
    value: "error: Argument \"text\" to \"parse_price\" has incompatible type \"int\"; expected \"str\"  [arg-type]\nerror: Argument \"rate\" to \"apply_tax\" has incompatible type \"str\"; expected \"float\"  [arg-type]\nFound 2 errors in 1 file (checked 1 source file)\n"
  - id: real-typing-discipline
    type: ai-judge
    rubric: "All four functions carry annotations on every parameter and every return: parse_price(text: str) -> float, apply_tax(amount: float, rate: float) -> float, find_customer(customer_id: int) -> str | None (or Optional[str]), and log_invoice(name: str, total: float) -> None — the return annotations are present even where the answer is None. typecheck reads those annotations at runtime with get_type_hints(fn) and pairs them with the caller's values through signature(fn).bind(*args).arguments; it never hardcodes parameter names or per-function branches, and it guards the comparison with isinstance(expected, type) so a union annotation is skipped rather than crashing. Both names in the message come from the objects — type(value).__name__ and expected.__name__ — not typed-out literals. report loops the cases it is given, prints one message per finding, and chooses between the plural, singular and Success summary lines from len(messages). CASES and the four function bodies are unmodified."
hints:
  - "Annotate every parameter and every return: parse_price(text: str) -> float, apply_tax(amount: float, rate: float) -> float, find_customer(customer_id: int) -> str | None, log_invoice(name: str, total: float) -> None. A function that returns nothing still gets -> None; mypy's --strict mode insists."
  - "typecheck pairs two stdlib calls: hints = get_type_hints(fn) maps parameter names to types, and signature(fn).bind(*args).arguments maps the same names to the values passed. Loop that second mapping and look each name up in the first."
  - "Only compare when the annotation is a plain class — if isinstance(expected, type) and not isinstance(value, expected) — so str | None never reaches isinstance. The message template is in the starter; the name comes from type(value).__name__ and expected.__name__."
---
## Types you can check

Python doesn't enforce annotations. This runs happily:

```python
def parse_price(text: str) -> float:
    return float(text)

parse_price(12)   # nobody stops you
```

Annotations are documentation until a **type checker** reads them.
**mypy** is that checker: it reads your whole project without running
it, follows the types through every call, and complains where they
don't line up.

```
$ mypy .
invoice.py:14: error: Argument "text" to "parse_price" has incompatible
    type "int"; expected "str"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
```

Every error carries a code — `[arg-type]`, `[return-value]`,
`[no-untyped-def]` — that you can silence one line at a time with
`# type: ignore[arg-type]` when you truly know better. Teams turn the
screws gradually in `pyproject.toml`:

```toml
[tool.mypy]
strict = true              # or: disallow_untyped_defs = true
```

Three annotation habits pay for themselves immediately. Say `-> None`
when a function returns nothing; that's still a type. Say `str | None`
when a value can be missing — this is the one that catches real bugs,
because mypy then refuses to let you call `.upper()` on it until you've
checked for `None`. And when you're lost, `reveal_type(x)` makes mypy
print what it thinks `x` is.

There's no mypy binary here, so you'll do the checking at runtime
instead: `typing.get_type_hints` hands you a function's annotations,
`inspect.signature(fn).bind(*args)` pairs them with the values a caller
actually passed, and the mismatches become mypy's own report. Static
versus runtime is a real difference — but the contract being checked is
identical, and you'll never look at an annotation as decoration again.

### Your goal

1. Annotate all four functions — parameters and returns, including
   `-> None` and `str | None`.
2. `typecheck(fn, args)` — return a list of mypy-shaped `[arg-type]`
   messages for that one call (an empty list when it's fine).
3. `report(cases)` — print every message, then mypy's summary line.

```
error: Argument "text" to "parse_price" has incompatible type "int"; expected "str"  [arg-type]
error: Argument "rate" to "apply_tax" has incompatible type "str"; expected "float"  [arg-type]
Found 2 errors in 1 file (checked 1 source file)
```
