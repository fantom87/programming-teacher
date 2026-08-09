---
id: 08-debugging-node
title: Debugging Node
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Hunt two bugs the way professionals do — read the stack trace to the crash line, then print-debug the silently wrong total — fix both, and write the one-line post-mortem for each."
docs: [javascript/debugging-devtools, javascript/strings, javascript/arrays]
checks:
  - id: parser-and-total-hold-up
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: honest-receipt
    type: stdout
    entry: main.js
    match: exact
    value: "3 items\nlatte 4.50\nbagel 3.25\ntea 2.75\ntotal: 10.50\n"
  - id: fixed-and-explained
    type: ai-judge
    rubric: "RAW is byte-for-byte unchanged from the starter (still ends with a newline — trimming the data would dodge the lesson). Bug 1 is fixed in parseItems by skipping or filtering blank/empty lines (a trim/continue guard or a filter before the loop), not by special-casing index counts, and a comment starting '// BUG 1:' correctly attributes the crash to the empty final element split produces from the trailing newline, which made parts[1] undefined. Bug 2 is fixed in totalOf by accumulating (total += item.price or total = total + item.price), and a '// BUG 2:' comment correctly names assignment-instead-of-accumulation (total held only the last price). Both explanations describe the actual root cause, not just 'it was broken', and the rest of the program logic is untouched."
hints:
  - "Run it first. The trace's TOP frame that lives in YOUR file is the scene of the crime: parseItems, at the parts[1].trim() line. Now ask what input makes parts[1] undefined — log `line` each pass and watch the last one."
  - "Fix 1 belongs in the parser, not the data: if (line.trim() === \"\") continue; — RAW keeps its trailing newline, because real files have them."
  - "After fix 1 it runs and lies: total is 2.75, the LAST price. Log total inside totalOf's loop — it never grows. Assignment where accumulation belongs: total += item.price."
---
## Loud bugs and quiet ones

Every bug you'll ever meet announces itself one of two ways — loudly,
with a **stack trace**, or quietly, with output that's simply wrong.
Today's starter has one of each, in that order.

The loud kind first. Run the starter and Node prints its crash report:

```
TypeError: Cannot read properties of undefined (reading 'trim')
    at parseItems (main.js:25:57)
    at Object.<anonymous> (main.js:38:15)
```

Read it like a pro: the first line says *what* exploded; the frames
below say *where*, newest call first. Scan down to the **topmost frame
in your own file** — that's the scene of the crime, with a
`file:line:column` address your editor can jump to. The question is
never "why is JavaScript broken" but "what value, arriving here, makes
this line impossible?" — then hunt *that* value.

The quiet kind has no address, so you interrogate the program:
`console.log` inside the loop and watch a variable evolve — honorable,
universal, and often fastest. (Prefer `console.error` for debug spam in
real tools: it goes to **stderr**, so it never corrupts output another
program is parsing — our runner shows the two streams separately.) When
prints aren't enough, `node --inspect main.js` attaches the *same
DevTools debugger you know from the browser* — `chrome://inspect`, or
VS Code's Run and Debug — breakpoints, step-over, hover-a-variable. A
`debugger;` statement pauses there whenever DevTools is attached.

House rule from every good post-mortem: **fix causes, not symptoms** —
and say what you found. The trailing newline in `RAW` is *normal*
(files end with one); deleting it would dodge the real lesson, so the
parser must tolerate it. Each fix gets a one-line `// BUG n:` comment
naming the root cause — the habit that turns debugging into knowledge.

### Your goal

1. Run, read the trace, fix the crash *in the parser*.
2. Run again, find why the total is 2.75, fix the accumulation.
3. Leave `// BUG 1:` and `// BUG 2:` comments naming each root cause:

```
3 items
latte 4.50
bagel 3.25
tea 2.75
total: 10.50
```
