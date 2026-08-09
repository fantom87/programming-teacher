---
id: 08-the-main-guard
title: "The __main__ Guard"
language: python
runner: local
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
  - path: greetings.py
    starter: starter/greetings.py
goal: "Wrap the demo line in greetings.py in an if __name__ == \"__main__\": guard so main.py's output is only the two real greetings, while running greetings.py directly still shows the demo."
docs: [python/modules-and-imports]
checks:
  - id: import-stays-silent
    type: stdout
    entry: main.py
    match: exact
    value: "Hello, Bradley!\nHello, Ada!\n"
  - id: direct-run-shows-demo
    type: stdout
    entry: greetings.py
    match: exact
    value: "Demo: Hello, tester!\n"
  - id: greeting-still-works
    type: tests
    entry: greetings.py
    testFile: tests/test_greetings.py
hints:
  - "print(__name__) in each file to see the difference: run directly it's \"__main__\", imported it's \"greetings\". (Take the print out afterwards.)"
  - "The guard is an ordinary if at top level: if __name__ == \"__main__\": with the demo print indented underneath."
  - "Don't delete the demo — the checks run greetings.py directly too and still expect Demo: Hello, tester! there."
---
## Library or program? Both.

Run `main.py` in the starter and look closely — there's a stowaway:

```
Demo: Hello, tester!
Hello, Bradley!
Hello, Ada!
```

That `Demo:` line lives in `greetings.py`. Nobody asked for it, but
remember how import works: **importing a file runs it**, top to bottom.
The `def` lines quietly create functions — and the loose `print` at the
bottom fires, right into your program's output.

That demo isn't junk, though. When you're working *on* a module, a quick
try-it-out line at the bottom is genuinely useful. You want it to run
when you run `greetings.py` directly — and stay silent when someone
imports it.

Python gives every file a variable `__name__` that answers "how am I
being run?":

- Run directly (`python greetings.py`) → `__name__` is `"__main__"`
- Imported (`import greetings`) → `__name__` is `"greetings"`

So the fix is one ordinary `if`, famous enough to have a name — the
**main guard**:

```python
if __name__ == "__main__":
    print("Demo:", make_greeting("tester"))
```

Read it as: *only when this file is the program, not the library.* You'll
find this pattern at the bottom of countless real Python files, guarding
demos, quick tests, and entire command-line interfaces. It's what lets
one file lead a double life: importable toolbox *and* runnable script.

### Your goal

1. In `greetings.py`, wrap the demo print in a `__main__` guard. Keep the
   demo — don't delete it.
2. `main.py` needs no changes — its output should now be exactly:

   ```
   Hello, Bradley!
   Hello, Ada!
   ```

The checker runs *both* files: `main.py` must be stowaway-free, and
`greetings.py` run directly must still print `Demo: Hello, tester!`.
