---
id: 04-fetch-and-apis
title: Fetch and APIs
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
  - path: users.json
    starter: starter/users.json
goal: "Write the professional fetch pattern — await the response, gate on res.ok, throw with the status, await .json() — against a local stand-in for fetch, then render the happy path and catch the 404."
docs: [javascript/async-and-promises, javascript/objects, javascript/arrays]
checks:
  - id: users-and-404
    type: stdout
    entry: main.js
    match: exact
    value: "3 users loaded\n- Ada (London)\n- Grace (Arlington)\n- Linus (Helsinki)\nrequest failed: HTTP 404 for https://api.example.com/nope\n"
  - id: the-fetch-pattern
    type: ai-judge
    rubric: "loadUsers(fetchFn, url) is an async function that awaits fetchFn(url), checks res.ok BEFORE touching the body, throws new Error carrying the status (and url) when not ok, and returns await res.json() (or the promise) on success — no .then chains doing the main flow, no res.json() call before the ok check. fakeFetch itself is unmodified from the starter. The runner code awaits loadUsers for the good URL and renders each user by looping the returned array (name and city interpolated — no user literals in main's own strings), then calls loadUsers on the bad URL inside try/catch and prints the caught error's .message. The four output lines about users contain no hardcoded names — delete a user from users.json and the report must shrink."
hints:
  - "async function loadUsers(fetchFn, url) { const res = await fetchFn(url); if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`); return res.json(); }"
  - "Happy path: const users = await loadUsers(fakeFetch, USERS_URL); console.log(`${users.length} users loaded`); then a for...of printing `- ${u.name} (${u.city})`."
  - "Sad path: try { await loadUsers(fakeFetch, BAD_URL); } catch (err) { console.log(`request failed: ${err.message}`); } — the message you threw is the message you catch."
---
## The four-line ritual

Since Node 18, the same `fetch` you'd use in a browser is a global in
Node — one HTTP client everywhere. And every professional call to it
runs the same four-line ritual:

```js
const res = await fetch(url);          // 1. await the response
if (!res.ok) {                         // 2. gate on ok
  throw new Error(`HTTP ${res.status} for ${url}`);
}
return res.json();                     // 3. parse — itself async
```

Line 2 is the one beginners skip. `fetch` only *rejects* when the
network itself fails — a `404 Not Found` or `500` is, to fetch, a
perfectly successful conversation. `res.ok` (true for statuses
200–299) is your gate, and it must come **before** `res.json()`: error
bodies are often HTML or empty, and parsing them throws the wrong
error in the wrong place. Line 3 returns a promise too — reading the
body is its own async step.

Our checks run offline and deterministic, so today you call the ritual
against **`fakeFetch`** — a stand-in in your starter with fetch's exact
contract (same promise, same `ok` / `status` / `.json()`), which
answers one good URL from the `users.json` beside your program and
404s everything else. Your `loadUsers(fetchFn, url)` takes the fetch
function *as a parameter* — the dependency-at-the-edge move from
lessons 1 and 2 — so the day you hand it the real global `fetch`,
nothing else changes. That is not a consolation prize; injecting a fake
transport is exactly how professionals test fetch code.

One more habit: the *caller* decides what a failure means. `loadUsers`
throws; the run code catches and prints — `try/catch` around `await`,
just like your async unit promised.

### Your goal

1. `loadUsers(fetchFn, url)` — the four-line ritual, throwing
   `` `HTTP ${status} for ${url}` `` on a bad response.
2. Await it for `https://api.example.com/users`; print the count, then
   one `- name (city)` line per user.
3. Call it for `https://api.example.com/nope` in a `try/catch`; print
   `request failed: <message>`:

```
3 users loaded
- Ada (London)
- Grace (Arlington)
- Linus (Helsinki)
request failed: HTTP 404 for https://api.example.com/nope
```
