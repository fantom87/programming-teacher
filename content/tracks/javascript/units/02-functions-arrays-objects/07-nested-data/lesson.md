---
id: 07-nested-data
title: Nested Data
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Read, modify, and map over a guild object whose members array holds objects with their own skills arrays — chaining dots and brackets to reach inside."
docs: [javascript/objects, javascript/arrays]
checks:
  - id: nested-access-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-guild-report
    type: stdout
    entry: main.js
    match: exact
    value: "Sam\n3\nAda, Sam, Rin\n"
hints:
  - "Chain one hop at a time: guild.members is an array, guild.members[1] is an object, guild.members[1].name is a string."
  - "Rin is at position 2, and her skills form an array — arrays have .length. Sam's skills have .push, like any array."
  - "For allNames, map each member object to its name: guild.members.map((member) => member.name)"
---
## Data inside data

Real data is rarely flat. A weather app holds a city, which holds days,
which hold temperatures. The pattern is always the same: **objects and
arrays nested inside each other** — and you climb through them by
chaining the accessors you already know.

The starter file has a `guild`: an object with a `members` array, where
every member is an object with its own `skills` array. To read Ada's
first skill, walk in one hop at a time:

```js
guild.members          // the array of member objects
guild.members[0]       // the first member  -> { name: "Ada", ... }
guild.members[0].name  // "Ada"
guild.members[0].skills[0]   // "archery"
```

Read chains like that left to right, asking at every hop: *what do I
have now — an object (use a dot) or an array (use brackets)?* When a
chain confuses you, split it and print the pieces — `console.log` on
each hop shows you exactly where you are.

Everything you know still applies at every level. Sam's `skills` is a
perfectly ordinary array, so it has `.push`, `.length`, `.includes`:

```js
guild.members[1].skills.push("juggling");
```

And `guild.members` is a perfectly ordinary array of objects — which
means `map` works on it. This is one of the most common moves in all of
JavaScript: an array of objects in, an array of just-one-field out:

```js
const names = guild.members.map((member) => member.name);
```

### Your goal

Using the starter `guild`:

1. `secondMember` — the *name* of the second member (mind the zero!).
2. `rinSkillCount` — how *many* skills Rin has.
3. Sam learns `"baking"` — push it onto his skills.
4. `allNames` — use `map` to collect every member's name.
5. Print `secondMember`, `rinSkillCount`, and `allNames.join(", ")`:

```
Sam
3
Ada, Sam, Rin
```
