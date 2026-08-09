---
id: 05-command-line-arguments
title: Command-Line Arguments
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Build a greeter CLI with argparse: build_parser() declares a positional name, --times (int, default 1), and a --shout flag; run(argv) parses an explicit argv list and prints the greeting."
docs: [python/stdlib-tour, python/functions]
checks:
  - id: parser-declares-the-interface
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-greetings
    type: stdout
    entry: main.py
    match: exact
    value: "Hello, Ada!\nHello, Grace!\nHello, Grace!\nHELLO, LINUS!\n"
  - id: args-drive-the-output
    type: ai-judge
    rubric: "build_parser declares name as a positional argument, --times with type=int and default=1, and --shout with action=\"store_true\". run(argv) calls parse_args(argv), builds the greeting from args.name (no names hardcoded into print calls), uppercases it only when args.shout is set, and prints it args.times times via a loop — the three demo calls at the bottom pass explicit argv lists."
hints:
  - "parser = argparse.ArgumentParser(description=\"greeter\") — then parser.add_argument(\"name\") is positional (no dashes), and parser.add_argument(\"--times\", type=int, default=1) arrives as a real int."
  - "--shout is a flag, not a value: parser.add_argument(\"--shout\", action=\"store_true\") makes args.shout a plain True/False."
  - "run(argv): args = build_parser().parse_args(argv); greeting = f\"Hello, {args.name}!\"; if args.shout: greeting = greeting.upper(); then print it in a for _ in range(args.times) loop."
---
## Programs with an interface

Every serious tool you use from a terminal takes arguments — `git
commit -m "fix"`, `python -X utf8 main.py`. Arguments are what turn a
script that does one hardcoded thing into a **tool** someone else can
drive. Python's standard answer is `argparse`: you *declare* the
interface, and it does the parsing, type conversion, and error messages
for you.

```python
import argparse

parser = argparse.ArgumentParser(description="greeting tool")
parser.add_argument("name")                          # positional: required
parser.add_argument("--times", type=int, default=1)  # option with a value
parser.add_argument("--shout", action="store_true")  # on/off flag
```

Three flavors, and they cover most CLIs ever written: a bare name is
**positional** (the user must supply it), `--times` is an **option**
(note `type=int` — argparse hands you a real number, not `"3"`), and
`action="store_true"` makes `--shout` a **flag** that's simply `True`
when present. Parsing returns a tidy object:

```python
args = parser.parse_args(["Grace", "--times", "2"])
args.name    # "Grace"
args.times   # 2 — an int
args.shout   # False
```

Notice we passed a **list**. Called with no arguments, `parse_args()`
reads the real command line — that's what happens when someone types
`python greet.py Grace --times 2`. Handing it an explicit list instead
is exactly how professionals *unit-test* their CLIs, no terminal
required — and it's how your program will run here, where there is no
command line to read. Same parser, same code path, testable output.

Keep the parser in its own function, `build_parser()` — real projects
do, so tests and entry points can share one definition of the
interface.

### Your goal

1. `build_parser()` — returns the parser above: positional `name`,
   `--times` (int, default 1), `--shout` flag.
2. `run(argv)` — parses `argv`, builds `Hello, {name}!`, uppercases it
   if `--shout` was given, prints it `--times` times.
3. Drive it three ways: `run(["Ada"])`, `run(["Grace", "--times",
   "2"])`, `run(["Linus", "--shout"])`:

```
Hello, Ada!
Hello, Grace!
Hello, Grace!
HELLO, LINUS!
```
