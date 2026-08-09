---
id: 07-sets
title: Sets
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Count total visits, build a set of unique visitors, add katherine to it, and print the visitor names in sorted order."
docs: [python/tuples-and-sets, python/lists]
checks:
  - id: unique-set
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-visitor-report
    type: stdout
    entry: main.py
    match: exact
    value: "6 visits\n3 unique visitors\nada\nalan\ngrace\nkatherine\n"
hints:
  - "set(visits) builds a set from the list — the duplicates simply vanish. len works on sets too."
  - "Sets grow with .add, not .append — there's no \"end\" to append to, because sets have no order."
  - "You can't loop a set in a reliable order, so loop over sorted(unique) — that's an alphabetical LIST of the names."
---
## The collection that ignores copies

A **set** keeps *unique* things. No duplicates, no positions — just
"which distinct values have I seen?" Feed a list to `set()` and watch
the repeats vanish:

```python
visits = ["ada", "grace", "ada", "alan", "grace", "ada"]
unique = set(visits)     # {"ada", "grace", "alan"} — three, not six
```

That one line answers a question that would otherwise need a loop and
careful bookkeeping: *how many different visitors came by?* It's just
`len(unique)`.

Sets grow with `.add`:

```python
unique.add("katherine")   # now 4 visitors
unique.add("ada")         # already there — nothing happens, no error
```

That second call is the quiet charm of sets: adding a duplicate is a
harmless no-op, so you can pour data in without checking first. And the
membership test you learned two lessons ago — `"ada" in unique` — is
the set's favorite question, the one it's built to answer instantly.

### No order? Sort before you print

Because a set has no positions, Python shows its items in whatever
internal order it likes — you can't count on it, so a set is never
printed raw in a program that promises exact output. When you need a
tidy printout, `sorted()` hands you the items as an **alphabetical
list** — and lists you know how to loop:

```python
for name in sorted(unique):
    print(name)      # ada, alan, grace, ... always in this order
```

List when order matters, dict when things have labels, set when only
*membership* matters. That's the whole collections toolbox.

### Your goal

The starter logs `visits` — six visits, regulars included.

1. Print the visit count: `6 visits`.
2. Build `unique` — the visitors as a set.
3. Print the unique count: `3 unique visitors`.
4. `.add` `"katherine"` to `unique`.
5. Loop over `sorted(unique)`, one name per line:

```
6 visits
3 unique visitors
ada
alan
grace
katherine
```
