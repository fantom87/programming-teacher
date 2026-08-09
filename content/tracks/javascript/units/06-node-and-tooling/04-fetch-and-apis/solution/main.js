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

// The four-line ritual. fetchFn arrives as a parameter, so handing this
// the real global fetch someday changes nothing else.
async function loadUsers(fetchFn, url) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  // Happy path: render whatever the "API" actually sent.
  const users = await loadUsers(fakeFetch, USERS_URL);
  console.log(`${users.length} users loaded`);
  for (const user of users) {
    console.log(`- ${user.name} (${user.city})`);
  }

  // Sad path: the caller decides what a failure means.
  try {
    await loadUsers(fakeFetch, BAD_URL);
  } catch (err) {
    console.log(`request failed: ${err.message}`);
  }
}

main();
