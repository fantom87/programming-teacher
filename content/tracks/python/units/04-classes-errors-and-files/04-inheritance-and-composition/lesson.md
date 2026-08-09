---
id: 04-inheritance-and-composition
title: Inheritance and Composition
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Create Manager as a subclass of Employee that stores an extra bonus via super().__init__ and overrides weekly_pay to add it — then print each team member's pay from one loop."
docs: [python/classes]
checks:
  - id: inheritance-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-team-pay
    type: stdout
    entry: main.py
    match: exact
    value: "Sam: $800\nAlex: $1400\n"
hints:
  - "Declare the parent in parentheses: class Manager(Employee): — Manager now starts with everything Employee has."
  - "Manager's __init__ takes name, hourly_rate, bonus. First line: super().__init__(name, hourly_rate) — let the parent store its part. Then self.bonus = bonus."
  - "Override weekly_pay: return super().weekly_pay() + self.bonus — then uncomment the team list and loop: for person in team: print(f\"{person.name}: ${person.weekly_pay()}\")"
---
## Is-a and has-a

Sometimes a new class is really *an old class, plus a bit more*. A
`Manager` **is an** `Employee` — same name, same hourly rate, but with a
weekly bonus on top. Python lets you say exactly that with
**inheritance**:

```python
class Manager(Employee):
    def __init__(self, name, hourly_rate, bonus):
        super().__init__(name, hourly_rate)
        self.bonus = bonus
```

The parentheses in `class Manager(Employee)` mean "start from Employee".
`super()` is the parent class: `super().__init__(...)` runs Employee's
initializer so the name and rate get stored exactly as before — no
copy-pasting those lines.

A subclass can also **override** a method — replace the parent's version
with its own. And inside the override, `super()` lets you *build on* the
original instead of duplicating it:

```python
    def weekly_pay(self):
        return super().weekly_pay() + self.bonus
```

The payoff comes when you mix both kinds in one list and just call the
method. Each object answers with its *own* version — the loop doesn't
know or care which is which. (That trick has a grand name:
*polymorphism*.)

One caution from the professional world: inheritance is tempting to
overuse. The other tool — **composition** — is a class that *contains*
other objects: a `Team` **has a** list of employees, a `Car` **has an**
`Engine`. Your `team` list below is composition in miniature. Rule of
thumb: *is-a* → inherit; *has-a* → compose. When in doubt, compose.

### Your goal

The starter gives you `Employee` with `weekly_pay` (rate × 40 hours).

1. Define `Manager(Employee)` — `__init__` takes `name`, `hourly_rate`,
   `bonus`; call `super().__init__(...)`, then store the bonus.
2. Override `weekly_pay` to add the bonus.
3. Uncomment the `team` list and print each member from **one** loop:

```
Sam: $800
Alex: $1400
```
