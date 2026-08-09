---
id: 04-metaclasses-and-protocols
title: Metaclasses and Protocols
language: python
runner: browser
estMinutes: 22
files:
  - path: main.py
    starter: starter/main.py
goal: "Write Registry — a metaclass whose __new__ auto-registers every plugin class by its format string — plus a @runtime_checkable Exporter Protocol, and prove both: the registry fills itself, and isinstance checks shape instead of ancestry."
docs: [python/classes, python/dicts]
checks:
  - id: registry-and-protocol-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-plugin-table
    type: stdout
    entry: main.py
    match: exact
    value: "csv: CsvExporter\njson: JsonExporter\nTrue\nFalse\n"
  - id: hooks-not-hardcoding
    type: ai-judge
    rubric: "Registry subclasses type and overrides __new__ (or __init__), building the class via super() and adding it to a shared plugins dict keyed by the class's format — only when format is truthy, so the Plugin base (format = None) stays out. Plugin declares metaclass=Registry; JsonExporter and CsvExporter merely subclass Plugin and set format — neither touches the registry directly, and no code outside the metaclass inserts into plugins. Exporter is a @runtime_checkable class Exporter(Protocol) with an export(self) -> str method. The table lines loop over sorted(Registry.plugins) printing key and class __name__ — never literal 'csv: CsvExporter' strings — and the True/False lines are real isinstance(JsonExporter(), Exporter) / isinstance('hello', Exporter) results."
hints:
  - "A metaclass subclasses type: class Registry(type): with plugins = {} on it, then def __new__(mcls, name, bases, ns): cls = super().__new__(mcls, name, bases, ns); if ns.get(\"format\"): Registry.plugins[cls.format] = cls; return cls."
  - "Plugin is declared with class Plugin(metaclass=Registry): format = None — subclasses inherit the metaclass, so defining CsvExporter(Plugin) with format = \"csv\" registers it with zero extra code."
  - "The protocol: @runtime_checkable above class Exporter(Protocol): def export(self) -> str: ... — then isinstance(x, Exporter) asks 'does x have an export method?', not 'does x inherit from Exporter?'."
---
## Classes are made by a class

Everything in Python is an object — including classes. `type(3)` is
`int`, and `type(int)` is `type`: classes are instances of `type`,
manufactured at runtime when the `class` statement finishes. A
**metaclass** is a subclass of `type` you slide into that machinery,
so *class creation itself* runs your code:

```python
class Registry(type):
    plugins = {}
    def __new__(mcls, name, bases, ns):
        cls = super().__new__(mcls, name, bases, ns)
        if ns.get("format"):
            Registry.plugins[cls.format] = cls
        return cls
```

Any class built with `metaclass=Registry` — or subclassing one that
was — passes through `__new__` on its way into existence. The classic
use is exactly this: a plugin table that fills itself. Drop a new
exporter file into the project, and it's registered the moment the
class statement runs. No central list to forget to update. (Django
models and SQLAlchemy tables work this way — and when all you need is
registration, the lighter `__init_subclass__` hook does the same job
without a metaclass.)

The second depth tool answers a different question: *what counts as an
exporter?* Inheritance says "anything descending from my base". A
**Protocol** says "anything with the right methods" — structural
typing, duck typing made checkable:

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Exporter(Protocol):
    def export(self) -> str: ...
```

`@runtime_checkable` lets `isinstance(obj, Exporter)` test *shape*: a
string fails (no `export`), your plugins pass — even if they never
imported `Exporter`. Type checkers use protocols the same way,
statically.

### Your goal

1. The `Exporter` protocol, exactly as above.
2. The `Registry` metaclass; then `class Plugin(metaclass=Registry)`
   with `format = None`.
3. `JsonExporter(Plugin)` (`format = "json"`, `export` returning
   `"{...}"`) and `CsvExporter(Plugin)` (`format = "csv"`, `export`
   returning `"a,b"`).
4. Print each `sorted(Registry.plugins)` entry as `key: ClassName`,
   then `isinstance(JsonExporter(), Exporter)`, then
   `isinstance("hello", Exporter)`:

```
csv: CsvExporter
json: JsonExporter
True
False
```
