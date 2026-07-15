# Lists

A list is an ordered collection of values — a row of labeled boxes you can grow, shrink, and rearrange. Lists are Python's workhorse container.

```python
todo = ["email Sam", "buy milk", "stretch"]
scores = [88, 92, 79]
mixed = ["Ada", 36, True]     # types can mix (but usually shouldn't)
empty = []
```

## Reading items

Positions (*indexes*) start at 0:

```python
todo[0]      # "email Sam"
todo[-1]     # "stretch"      negative = from the end
todo[0:2]    # ["email Sam", "buy milk"]   slice: end excluded
len(todo)    # 3
```

Asking for a position that doesn't exist raises `IndexError: list index out of range` — the list is shorter than you thought.

## Changing lists

Unlike strings, lists are *mutable* — you can change them in place:

```python
todo.append("call mum")       # add to the end
todo.insert(0, "wake up")     # add at position 0
todo[1] = "email Sam ASAP"    # replace an item
todo.remove("buy milk")       # remove by value
last = todo.pop()             # remove & return the last item
```

## Looping over a list

```python
for task in todo:
    print(f"- {task}")
```

Need the position too? Use `enumerate`:

```python
for i, task in enumerate(todo, start=1):
    print(f"{i}. {task}")
```

## Checking and searching

```python
"stretch" in todo        # True or False
todo.index("stretch")    # position of first match
todo.count("stretch")    # how many times it appears
```

## Sorting

```python
scores = [88, 92, 79]
scores.sort()                 # in place: [79, 88, 92]
scores.sort(reverse=True)     # [92, 88, 79]
sorted_copy = sorted(scores)  # new list, original untouched
```

## A common trap: copying

`b = a` doesn't copy a list — both names point to the *same* list:

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)         # [1, 2, 3, 4]  — a changed too!
c = a.copy()     # a real, independent copy
```

When a list changes "mysteriously," a shared reference is usually the culprit.
