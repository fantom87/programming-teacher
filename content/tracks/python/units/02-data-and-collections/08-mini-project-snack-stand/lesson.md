---
id: 08-mini-project-snack-stand
title: "Mini-Project: Snack Stand"
language: python
runner: browser
estMinutes: 25
files:
  - path: main.py
    starter: starter/main.py
goal: "Loop over the snacks list of dicts to print the stand report — a line per snack plus a computed sold-out count and stock value — then answer the wish with a membership test."
docs: [python/dicts, python/lists, python/conditionals]
checks:
  - id: report-accumulators
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-report
    type: stdout
    entry: main.py
    match: exact
    value: "SNACK STAND REPORT\ngranola bar: $2 each, 12 left\ntrail mix: $3 each, 0 left\napple: $1 each, 25 left\ncocoa: $2 each, 0 left\nSold out: 2\nStock value: $49\nno banana today\n"
  - id: computed-not-typed
    type: ai-judge
    rubric: "The report comes from ONE pass over snacks: a for loop whose snack lines are f-strings reading snack[\"name\"], snack[\"price\"], and snack[\"stock\"] from the current dict — no snack line is a hardcoded string. Before the loop, names starts as [], sold_out and total_value as 0; inside it, names grows via append, sold_out counts stock == 0 with an if, and total_value accumulates price * stock. The Sold out and Stock value lines print those variables (the literals 2 and 49 never appear in a print). The last line uses a membership test (in or not in) on names with the wish variable and has both a found and a not-found branch — changing the snacks data or wish would change the whole report."
hints:
  - "Each snack is a dict INSIDE the list — the loop hands you one dict per trip, and snack[\"price\"] reads its price."
  - "Set up names = [], sold_out = 0, total_value = 0 BEFORE the loop; every trip feeds all three while printing its line."
  - "Quotes inside an f-string need the other style: f\"{snack['name']}: ${snack['price']} each, {snack['stock']} left\". After the loop: if wish in names:"
---
## Your data, stacked

This mini-project runs on the shape professional data actually arrives
in: a **list of dicts**. Each dict is one record — a snack with a name,
a price, a stock count — and the list is the stack of records:

```python
snacks = [
    {"name": "granola bar", "price": 2, "stock": 12},
    ...
]
```

Loop over the list and each trip hands you one whole dict; reach inside
it with keys:

```python
for snack in snacks:
    print(snack["name"], snack["price"])
```

That's **nested data** — collections inside collections — and every
tool from this unit gets to work on it at once.

You're printing the morning report for a snack stand, under the rule
that makes reports professional: **every number on screen is computed
from the data**. Change a price or a stock count tomorrow and the
report must stay correct without touching another line. An AI reviewer
will check exactly that — no hardcoded answers.

Three accumulators start empty before the loop, and every trip feeds
all three:

- `names` — start `[]`, `append` each snack's name
- `sold_out` — start `0`, count the snacks whose stock is `0`
- `total_value` — start `0`, add each snack's `price * stock`

After the loop come the two summary lines, then one last membership
test: someone at the window asks for `wish`. Is it in `names`?

### Your goal

Print exactly:

```
SNACK STAND REPORT
granola bar: $2 each, 12 left
trail mix: $3 each, 0 left
apple: $1 each, 25 left
cocoa: $2 each, 0 left
Sold out: 2
Stock value: $49
no banana today
```

1. The heading, then **one loop** over `snacks` printing each snack's
   line from its dict — while feeding `names`, `sold_out`, and
   `total_value`.
2. The `Sold out:` and `Stock value:` lines, printed from your
   accumulators.
3. If `wish` is in `names`, print `<wish> today: yes`; otherwise print
   `no <wish> today`.
