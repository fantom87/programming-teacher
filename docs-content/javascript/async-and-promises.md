# Async and promises

Some things take time: fetching data from a server, reading a file, waiting for a timer. JavaScript doesn't freeze while it waits — it keeps going and comes back when the slow thing finishes. That's **asynchronous** code.

## Promises: an IOU for a value

A **promise** is an object that says "I don't have your value *yet*, but I promise to deliver it (or an error) later." A promise is either *pending*, *fulfilled* (success), or *rejected* (failure).

```js
fetch("https://api.example.com/users")   // fetch returns a promise
  .then((response) => response.json())   // .then runs when it fulfills
  .then((users) => console.log(users))
  .catch((error) => console.error("Something went wrong:", error));
```

## async/await: promises that read like normal code

`await` pauses *inside a function* until a promise settles, then hands you the value. Mark the function `async` to use it:

```js
async function loadUsers() {
  const response = await fetch("https://api.example.com/users");
  const users = await response.json();
  console.log(users);
}

loadUsers();
```

Same behavior as the `.then` chain, but it reads top-to-bottom. The rest of your program keeps running while the function waits.

## Handling errors with try/catch

```js
async function loadUsers() {
  try {
    const response = await fetch("https://api.example.com/users");
    if (!response.ok) {
      throw new Error(`Server said ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load users:", error.message);
    return [];   // a sensible fallback
  }
}
```

Note: `fetch` only rejects on network failure — a 404 still "succeeds," so check `response.ok` yourself.

## Waiting for several things at once

```js
const [users, posts] = await Promise.all([
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/posts").then((r) => r.json()),
]);
```

`Promise.all` runs them in parallel and resolves when all finish — much faster than awaiting one after another.

## A timer, promisified

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await wait(1000);   // pause one second
console.log("One second later");
```

Mental model: `async` functions let you write "wait for this, then do that" without stopping the whole world.
