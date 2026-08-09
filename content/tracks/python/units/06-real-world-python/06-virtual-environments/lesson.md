---
id: 06-virtual-environments
title: Virtual Environments
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Model what venv guarantees: create_env(name) builds a fresh, isolated environment dict each call, install(env, package) touches only that env, and describe(env) reports what each project sees."
docs: [python/venv-and-pip]
checks:
  - id: envs-are-isolated
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-both-envs
    type: stdout
    entry: main.py
    match: exact
    value: "blog: pip, flask==3.1.2\nscraper: pip, requests==2.32.5, beautifulsoup4==4.13.5\n"
  - id: isolation-is-real
    type: ai-judge
    rubric: "create_env builds and returns a NEW dict with a fresh [\"pip\"] list literal on every call — no shared module-level list, no mutable default argument, no aliasing that would let one env's installs leak into another. install(env, package) appends to the env it was handed and nothing else. describe returns the formatted line rather than printing inside itself, and the two printed lines come from describe() on computed data, not hardcoded strings."
hints:
  - "create_env builds a brand-new dict: return {\"name\": name, \"packages\": [\"pip\"]}. The fresh list literal INSIDE the function is what makes each env isolated."
  - "install(env, package) is one line — env[\"packages\"].append(package). It touches only the env you hand it, exactly like pip inside an activated venv."
  - "describe: return f\"{env['name']}: \" + \", \".join(env[\"packages\"]). Then create blog and scraper, install flask==3.1.2 into blog and requests==2.32.5 + beautifulsoup4==4.13.5 into scraper, and print describe() of each."
---
## One Python per project

Here's the disaster venv exists to prevent. Project A needs version 2
of some library; project B needs version 3. With one shared Python,
installing for B silently breaks A — the classic "it worked yesterday."
The fix: give **every project its own private environment**, with its
own packages. On your real machine it's three commands:

```
py -m venv .venv
.venv\Scripts\activate        # Windows  (macOS/Linux: source .venv/bin/activate)
deactivate                    # when you're done
```

The first builds a `.venv` folder — a private copy of Python plus its
own empty package shelf (only `pip` preinstalled). *Activating* simply
points your terminal's `python` and `pip` at that folder, so everything
you install lands there and nowhere else. Two rules of professional
hygiene: one venv per project, and `.venv` never goes into git — it's
rebuildable, as the next lesson shows.

We can't build real venvs inside this runner, so instead you'll model
the *guarantee* that makes them work — in Python you already know. An
environment is just a dict with a name and a package list:

```python
{"name": "blog", "packages": ["pip"]}
```

The whole point is **isolation**: every `create_env` call must return a
*fresh* dict with a *fresh* list. If two envs ever share one list —
say, via a module-level `PACKAGES` both point at — installing into one
"installs" into both, which is precisely the shared-Python disaster
again. Your tests check for exactly that leak.

### Your goal

1. `create_env(name)` — returns a new env dict, packages starting as
   `["pip"]`, fresh on every call.
2. `install(env, package)` — appends `package` to that env's list only.
3. `describe(env)` — returns `"name: pkg, pkg, ..."` for printing.
4. Create `blog` and `scraper` envs; install `flask==3.1.2` into blog,
   `requests==2.32.5` then `beautifulsoup4==4.13.5` into scraper; print
   both descriptions:

```
blog: pip, flask==3.1.2
scraper: pip, requests==2.32.5, beautifulsoup4==4.13.5
```
