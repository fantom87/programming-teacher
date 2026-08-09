---
id: 05-closures-in-depth
title: Closures in Depth
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Write makeBank(opening) — three methods sharing one closure-private balance — and once(fn), a wrapper that runs any function a single time and remembers the answer."
docs: [javascript/functions-and-closures]
checks:
  - id: closures-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "150\ndeclined\n120\nigniting!\nengine on\nengine on\n"
  - id: real-shared-closure
    type: ai-judge
    rubric: "makeBank declares its balance variable inside the factory — not at module level and not as a data property on the returned object — and the returned deposit/withdraw/balance methods all close over that ONE variable; withdraw checks funds and returns 'declined' without changing it. once keeps its called flag and stored result in its own closure, forwards arguments with a rest parameter (or equivalent), and returns the FIRST call's result on every later call. No global variables track any of this state."
hints:
  - "Inside makeBank: let balance = opening; then return an object whose three methods all read and write that same balance — no this needed anywhere."
  - "withdraw guards first: if (amount > balance) return \"declined\"; — otherwise subtract and return the new balance."
  - "once: let called = false; let result; — the wrapper runs fn(...args) only while called is false, flips the flag, and returns the saved result forever after."
---
## One memory, many doors

Last unit, `makeCounter` returned *one* function with a private count.
The deeper pattern — the one professionals actually ship — returns
**several** functions born in the same factory call, all sharing the
same private memory:

```js
function makeBank(opening) {
  let balance = opening;
  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) { /* your job */ },
    balance() { return balance; },
  };
}
```

All three methods closed over the *same* `balance`, because they were
created in the same `makeBank` call. Deposit through one door and the
other doors see the change. And from outside? Untouchable. There is no
`savings.balance` property to corrupt — try `JSON.stringify(savings)`
and you get `{}` — the number lives only in the closure, reachable only
through the methods you chose to hand out. Before JavaScript grew `#`
private class fields, this *was* privacy, and half the libraries you'll
ever import still work this way.

The second half generalizes closures into a **wrapper**: `once(fn)`
takes *any* function and returns a version that only truly runs the
first time:

```js
const boot = once(() => { console.log("igniting!"); return "engine on"; });
boot();   // igniting!  → "engine on"
boot();   // (silent)   → "engine on" — remembered, not re-run
```

The closure holds two things: a `called` flag and the saved `result`.
Notice the wrapper's shape — `(...args) => ...` — lesson 1's rest
parameter, forwarding whatever arguments arrive to the wrapped `fn`.
Wrappers-with-memory is a pattern you'll meet everywhere: `once`,
memoize, debounce, throttle. Today you build the simplest one for real.

### Your goal

1. `makeBank(opening)` — returns `{ deposit, withdraw, balance }`
   sharing one private balance: deposit adds and returns the new
   balance; withdraw returns `"declined"` (unchanged) when funds are
   short, otherwise subtracts and returns the new balance; `balance()`
   reports it.
2. `once(fn)` — returns a wrapper that calls `fn` only the first time
   and returns that first result on every call after.
3. Run the starter's demo:

```
150
declined
120
igniting!
engine on
engine on
```
