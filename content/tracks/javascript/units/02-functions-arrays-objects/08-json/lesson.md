---
id: 08-json
title: JSON
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Turn the settings object into a JSON string with JSON.stringify, turn the saveFile string back into an object with JSON.parse, and read data out of the result."
docs: [javascript/objects, javascript/strings]
checks:
  - id: json-roundtrip-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-save-and-load
    type: stdout
    entry: main.js
    match: exact
    value: "{\"theme\":\"dark\",\"volume\":7,\"muted\":false}\nAda is level 12\nrope\n"
hints:
  - "Saving is one call: const saved = JSON.stringify(settings); — the result is a plain string."
  - "Loading is the mirror image: const loaded = JSON.parse(saveFile); — now loaded.player and loaded.level work like any object."
  - "loaded.inventory is a real array again — its first item is loaded.inventory[0]."
---
## Objects as text

Your objects live only while the program runs — close the tab and
they're gone. To *save* an object to a file, or *send* one across the
internet, it has to become **text**. JavaScript's format for that is
**JSON** (JavaScript Object Notation), and the whole world adopted it:
web APIs, config files, game saves — JSON everywhere.

Two built-in functions do all the work, and they're mirror images:

**`JSON.stringify(value)`** — object in, string out:

```js
const pet = { name: "Biscuit", age: 3 };
const text = JSON.stringify(pet);
// '{"name":"Biscuit","age":3}'
```

**`JSON.parse(text)`** — string in, object out:

```js
const back = JSON.parse('{"name":"Biscuit","age":3}');
console.log(back.age);   // 3 — a real object again
```

Look at the JSON text closely: it's *almost* how you write object
literals, with two strict differences — keys always wear double quotes,
and there's no trailing comma, ever. JSON handles nested data happily
(arrays in objects in arrays), which is why last lesson matters here.

One thing to internalize: `JSON.stringify(pet)` is a **string** — you
can't ask it for `.name` any more than you could ask `"hello"` for one.
And `JSON.parse` gives you a fresh, fully working object with real
arrays inside. String out, object back — a *round trip*.

(Bonus for humans: `JSON.stringify(pet, null, 2)` pretty-prints with
2-space indentation. Try it in the console.)

### Your goal

The starter has a `settings` object and a `saveFile` string (JSON from
an imaginary game).

1. `saved` — turn `settings` into a JSON string with `JSON.stringify`,
   and print it.
2. `loaded` — turn `saveFile` back into a real object with `JSON.parse`.
3. Print `` `${loaded.player} is level ${loaded.level}` ``.
4. Print the *first* item in `loaded.inventory`:

```
{"theme":"dark","volume":7,"muted":false}
Ada is level 12
rope
```
