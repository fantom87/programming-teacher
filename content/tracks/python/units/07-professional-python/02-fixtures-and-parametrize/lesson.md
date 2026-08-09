---
id: 02-fixtures-and-parametrize
title: Fixtures and Parametrize
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Give the Cart tests professional setup: a fresh_cart() fixture so every test gets isolated state, two tests that use it, and one parametrized test driven by a TOTAL_CASES table with per-case failure messages."
docs: [python/functions, python/classes, python/lists]
checks:
  - id: fixture-and-cases-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: suite-is-green
    type: stdout
    entry: main.py
    match: exact
    value: "...\n3 passed\n"
  - id: setup-discipline
    type: ai-judge
    rubric: "Every test acquires its cart by calling fresh_cart() inside its own body — there is no module-level shared cart and no test touches state another test created. fresh_cart contains no globals and returns Cart(). test_totals_parametrized is one body iterating TOTAL_CASES (no copy-pasted per-case test functions), builds a fresh cart per case, and its assert carries an f-string message naming the failing case's prices the way pytest parametrize ids do. TOTAL_CASES holds literal expected totals (not expressions recomputing sum(prices)), includes the empty-cart case, and Cart plus run_tests are unmodified."
hints:
  - "The fixture is tiny on purpose: def fresh_cart(): return Cart() — its value is WHERE it's called: at the top of every test, never at module level."
  - "Isolation test: add an item to one fresh_cart(), then assert a second fresh_cart().count() == 0. If that fails, state is being shared."
  - "Parametrized body: for prices, expected in TOTAL_CASES: build a cart, add every price, then assert cart.total() == expected, f\"case {prices}: expected {expected}, got {cart.total()}\" — the message is your parametrize id."
---
## Setup is where test suites rot

Two pytest features keep big suites honest. The first is the
**fixture** — setup as an injectable function:

```python
@pytest.fixture
def cart():
    return Cart()

def test_add(cart):          # pytest sees the parameter name,
    cart.add("mug", 8.50)    # calls the fixture, hands you the result
    assert cart.count() == 1
```

Every test that names `cart` as a parameter gets a **brand-new cart**.
That's the whole point: no shared module-level object that test three
dirties for test seven. Fixtures compose (a `db` fixture can use a
`config` fixture) and can clean up after themselves with `yield`.

The second is **parametrize** — one test body, a table of cases:

```python
@pytest.mark.parametrize("prices,total", [([2.50, 3.00], 5.50), ([], 0.0)])
def test_total(prices, total): ...
```

pytest runs it once *per row* and reports each as its own test, with
the case values right in the test id: `test_total[prices0-5.5]`.

Our runner has no decorator machinery, so you'll build the same two
ideas the direct way — which is also how you'll recognize them in any
codebase: a **factory function** called at the top of each test
(fixture), and a **case table plus loop** with the case echoed in every
assert message (parametrize). Same guarantees: isolation and coverage
per case; only the syntax is humbler. The `Cart` class and the mini
test runner from last lesson are provided.

### Your goal

1. `fresh_cart()` — returns a new `Cart` every call.
2. `test_add_increases_count` — one item added to a fresh cart,
   `count()` is 1. `test_carts_are_isolated` — add to one fresh cart,
   assert a *second* `fresh_cart()` is still empty.
3. `TOTAL_CASES` — at least three `(prices, expected_total)` rows,
   including `([], 0.0)` and a multi-item row.
   `test_totals_parametrized` — loops the table, builds a fresh cart
   per case, asserts `total()` with a message naming the case.
4. Output stays:

```
...
3 passed
```
