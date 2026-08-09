---
id: 01-your-first-list
title: Your First List
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Append a third task to the tasks list, print the task count with len in an f-string, then loop over the list printing each task."
docs: [python/lists, python/loops]
checks:
  - id: list-grows
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-task-report
    type: stdout
    entry: main.py
    match: exact
    value: "You have 3 tasks\nfeed the cat\nwrite some code\ngo outside\n"
hints:
  - "tasks.append(\"go outside\") adds to the END of the list. No = sign — append reaches in and changes the list in place."
  - "len(tasks) is the item count — drop it into an f-string: f\"You have {len(tasks)} tasks\"."
  - "The loop is for task in tasks: with print(task) indented underneath — one trip per item, in order."
---
## A box that holds many things

So far every variable has held exactly one thing. Real programs juggle
many — five tasks, fifty scores, a thousand names. A **list** is
Python's container for an ordered pile of values:

```python
colors = ["red", "green", "blue"]
```

Square brackets, commas between items. The order you write them is the
order Python keeps.

Three tools cover most everyday list work:

- `len(colors)` — how many items? (`3`)
- `colors.append("pink")` — add one to the **end**
- looping — visit every item, in order:

```python
for color in colors:
    print(color)
```

That loop is new. `range` gave you numbers; this loop walks the **list
itself** — each trip, `color` holds the next item. No counting, no
positions: "for each color in colors" reads like English.

One surprise worth staring at: `append` doesn't use `=`. It reaches
into the list and changes it in place:

```python
colors.append("pink")            # right — the list grows
colors = colors.append("pink")   # wrong — this destroys the list!
```

That second line actually stores `None`, because `append` returns
nothing. It's a classic early bug — now it's one you'll recognize on
sight.

Lists and loops are a team you'll use in nearly every program from here
on. Today is your first full round trip: build, grow, measure, walk.

### Your goal

The starter gives you a `tasks` list holding two chores.

1. `append` a third: `"go outside"`.
2. Print how many tasks there are, using `len` inside an f-string.
3. Loop over the list, printing each task on its own line.

```
You have 3 tasks
feed the cat
write some code
go outside
```
