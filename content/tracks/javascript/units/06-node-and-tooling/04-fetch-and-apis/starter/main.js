import { readFileSync } from "node:fs";

// fetch's exact contract, no network: one good route served from the
// users.json beside this file, a 404 for everything else.
// Leave fakeFetch as-is — your code goes below it.
function fakeFetch(url) {
  if (url === "https://api.example.com/users") {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(JSON.parse(readFileSync("users.json", "utf8"))),
    });
  }
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: "not found" }),
  });
}

const USERS_URL = "https://api.example.com/users";
const BAD_URL = "https://api.example.com/nope";

// 1. async loadUsers(fetchFn, url) — the four-line ritual:
//    await fetchFn(url); gate on res.ok BEFORE the body;
//    throw `HTTP ${status} for ${url}` when not ok; return res.json().

// 2. In an async main(): await loadUsers(fakeFetch, USERS_URL),
//    print `${users.length} users loaded`, then `- name (city)` per user.

// 3. Still in main(): try { await loadUsers(fakeFetch, BAD_URL) }
//    catch — print `request failed: ${err.message}`.

// main();
