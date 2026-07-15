# How code runs

You write code as text — but computers only truly understand *machine code*, streams of numbers wired into the processor. Something has to bridge that gap. There are two main bridges: interpreters and compilers.

## Interpreters: read and do, line by line

An interpreter reads your code and performs each instruction as it goes, like a musician sight-reading sheet music. Python works this way. When you run:

```python
print("step 1")
print("step 2")
```

the Python interpreter reads line 1, does it, then reads line 2, does it. If line 50 has an error, lines 1–49 still ran before the crash.

You run a Python file by handing it to the interpreter:

```bash
python my_program.py
```

## Compilers: translate first, run later

A compiler translates your *whole* program into machine code first, producing a separate runnable file. Languages like C and Rust work this way — like translating a whole book before anyone reads it. Errors are caught during translation, before the program ever runs.

## Top to bottom, one step at a time

However it runs, code executes in order, one statement at a time:

```python
x = 2        # first
x = x + 3    # second: x is now 5
print(x)     # third: prints 5
```

Loops and conditionals can *change the path* through the code, but at any moment the computer is doing exactly one thing. When a program confuses you, ask: "what order do these lines actually run in?"

## Where your program lives

While running, your program's data (variables, lists, text) lives in *memory* (RAM) — fast but temporary. When the program ends, memory is wiped. Anything you want to keep must be saved to a *file* on disk. That's why "save your work" is a thing!

Understanding this flow — text file → interpreter → instructions running in memory — demystifies most of what happens when you press Run.
