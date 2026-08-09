---
id: 02-fixtures-and-parametrize
title: Fixtures and Parametrize
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Give the Cart suite professional setup: a fresh_cart() fixture every test calls for its own isolated cart, two tests that prove the isolation, and one table-driven test over TOTAL_CASES whose assert message names the failing case."
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
  - id: real-fixture-discipline
    type: ai-judge
    rubric: "Every test builds its cart by calling fresh_cart() inside its own body: there is no module-level cart, no global cart variable, and no test relies on state another test created. fresh_cart takes no parameters, touches no globals, and just returns a new Cart(). test_totals is a single loop over TOTAL_CASES — not copy-pasted per-case test functions — that builds a fresh cart for each case and whose assert carries an f-string message naming that case's prices, the way pytest parametrize puts case values in the test id. TOTAL_CASES stores literal expected totals rather than expressions like sum(prices) that would recompute the answer under test, and includes both an empty-cart case and a multi-item case. The Cart class and run_tests are unmodified."
hints:
  - "The fixture is deliberately tiny: def fresh_cart(): return Cart(). All its value is in WHERE you call it — first line of every test, never at module level."
  - "For the isolation test, add an item to one fresh_cart(), then assert that a second fresh_cart().count() == 0. If that ever fails, some state is being shared."
  - "Table-driven body: for prices, expected in TOTAL_CASES: cart = fresh_cart(); for price in prices: cart.add(\"item\", price); then assert cart.total() == expected, f\"case {prices}: expected {expected}, got {cart.total()}\" — that message is your parametrize id."
---
## Where suites rot

Two pytest features keep a growing suite honest. The first is the
**fixture** — setup as a function you request by name:

```python
import pytest

@pytest.fixture
def cart():
    return Cart()

def test_add(cart):          # pytest sees the parameter name,
    cart.add("mug", 8.50)    # calls the fixture, hands you the result
    assert cart.count() == 1
```

Every test that names `cart` gets a *brand-new* cart. That's the entire
point: no module-level object that test three dirties for test seven.
Fixtures compose (a `db` fixture may request a `config` fixture), they
clean up after themselves when written with `yield`, and putting them
in `conftest.py` shares them across a whole directory of test files —
no import needed. pytest ships useful ones already: `tmp_path` for a
throwaway directory, `capsys` for captured output.

The second is **parametrize** — one body, a table of cases:

```python
@pytest.mark.parametrize("prices,total", [([2.50, 3.00], 5.50), ([], 0.0)])
def test_total(prices, total):
    ...
```

pytest runs that once *per row* and reports each row as its own test,
with the values right in the id: `test_total[prices0-5.5]`. Adding a
case is adding a line — which is why parametrized tests grow while
copy-pasted ones stagnate.

Our runner has no decorator machinery, so you'll build both ideas the
direct way — which is also how you'll recognize them anywhere: a
**factory function called at the top of each test** (the fixture), and
a **case table plus a loop, with the case echoed in the assert
message** (parametrize). Same two guarantees: isolation, and one case
never hiding another. `Cart` and the runner from last lesson are
provided.

### Your goal

1. `fresh_cart()` — returns a new `Cart` on every call.
2. `test_add_increases_count` — one item into a fresh cart, `count()`
   is 1. `test_carts_are_isolated` — add to one fresh cart, then assert
   a *second* `fresh_cart()` is still empty.
3. `TOTAL_CASES` — at least three `(prices, expected_total)` rows,
   including `([], 0.0)` and a multi-item row. `test_totals` loops the
   table, builds a fresh cart per case, and asserts `total()` with a
   message naming that case.
4. Output stays:

```
...
3 passed
```
