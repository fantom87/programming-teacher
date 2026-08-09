---
id: 08-async-error-handling
title: Async Error Handling
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Write loadUser(id) — try/catch/finally around an await of the flaky fetchUser — so a bad id becomes a guest fallback instead of an uncaught rejection, then print both lookups from an async main."
docs: [javascript/async-and-promises, javascript/debugging-devtools]
checks:
  - id: prints-both-paths
    type: stdout
    entry: main.js
    match: exact
    value: "lookup finished: ada\nAda (pro)\nlookup finished: zoe\nguest (no such user: zoe)\n"
  - id: real-error-handling
    type: ai-judge
    rubric: "loadUser is an async function whose try block awaits fetchUser and returns the `${user.name} (${user.plan})` string; the catch builds the guest fallback from err.message (the string 'no such user' never appears typed in loadUser or main); the lookup-finished line lives in ONE finally block, not duplicated into try and catch; and the provided fetchUser is unmodified. main awaits the two lookups sequentially and prints their return values — no rejection ever escapes (the program must not rely on uncaught-rejection output), and no .then/.catch chain substitutes for try/catch."
hints:
  - "The skeleton: try { const user = await fetchUser(id); return `${user.name} (${user.plan})`; } catch (err) { … } finally { … } — the await line is the one that can throw."
  - "catch receives the Error object — err.message is the text fetchUser threw, so the fallback is return `guest (${err.message})`;"
  - "finally runs on success AND failure — that's why \"lookup finished\" appears for both ada and zoe without being written twice."
---
## When the IOU bounces

Half of async programming is the unhappy path: the server's down, the
id doesn't exist, the file moved. A promise that fails **rejects**, and
inside an async function rejection comes from the keyword you'd guess:

```js
throw new Error(`no such user: ${id}`);
```

`new Error` packages a message (readable later as `err.message`);
`throw` stops the function and rejects its promise. The starter's
`fetchUser` does exactly this for unknown ids, 40ms into its fake
network trip.

If *nobody* handles a rejection, it detonates as
`Uncaught (in promise) Error: no such user: zoe` — the async cousin of a
crash, and a line you'll meet often in DevTools. The fix is beautifully
familiar: **an awaited promise that rejects `throw`s right at the
`await` line** — so ordinary `try/catch` handles it:

```js
async function loadUser(id) {
  try {
    const user = await fetchUser(id);   // the line that can explode
    return `${user.name} (${user.plan})`;
  } catch (err) {
    return `guest (${err.message})`;    // failure, converted to an answer
  } finally {
    console.log(`lookup finished: ${id}`);
  }
}
```

Read the shape. `try` holds the happy path. `catch` turns failure into
something usable — a guest profile beats a dead app, and it builds the
message from `err.message` rather than guessing. `finally` runs in
*both* cases — logging, spinners off, cleanup — written once, never
twice.

The deeper skill is deciding where errors *stop*. `fetchUser` throws —
it can't know what you'd want instead. `loadUser` decides policy: every
failure becomes a guest. So `main` gets to be blissfully simple: await,
print, await, print — no error handling at all, because `loadUser`
guaranteed its promise never rejects. Errors handled at exactly one
level, chosen on purpose — that's what professional async code looks
like.

(The `.then` world spells it `.catch(...)` — same idea; `try/catch`
around `await` is how you'll usually write it.)

### Your goal

1. `loadUser(id)` — async, per the shape above: try the fetch and
   return `` `${name} (${plan})` ``; catch into
   `` `guest (${err.message})` ``; finally print
   `` `lookup finished: ${id}` ``.
2. `main()` — async: print `await loadUser("ada")`, then
   `await loadUser("zoe")`; call `main()` at the bottom:

```
lookup finished: ada
Ada (pro)
lookup finished: zoe
guest (no such user: zoe)
```
