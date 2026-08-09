// The event loop, choreographed. Source order below — printed order is
// the event loop's business, and the checker demands the exact result.

console.log("open");

// 1. setTimeout(..., 0) printing "timer a"

// 2. queueMicrotask printing "micro a" — and inside that callback,
//    queue a SECOND microtask printing "micro c"

// 3. Promise.resolve("micro b").then(...) printing the resolved value

// 4. setTimeout(..., 0) printing "timer b"

console.log("close");

// Predict before you run: sync lines, then the whole microtask queue
// (even the nested one), then — and only then — the timers.
