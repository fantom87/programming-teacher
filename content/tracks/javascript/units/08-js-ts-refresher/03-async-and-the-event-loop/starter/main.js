// Async drills — the event loop, promisified timers, Promise.all.

// 1. delay(ms) -> a Promise that resolves after ms milliseconds.
//    new Promise + setTimeout — the promisified timer everyone rewrites.

// 2. trace() — four logs that prove you know the queues:
//    log "sync 1",
//    schedule console.log("macrotask") with setTimeout(..., 0),
//    queue console.log("microtask") with Promise.resolve().then(...),
//    log "sync 2".

// 3. finishLine() — async. Start BOTH racers, THEN one await Promise.all:
//    delay(60).then(() => "tortoise") and delay(20).then(() => "hare"),
//    in that order. Log the resolved array joined with ", ".

// Drill — leave these lines exactly as they are:
trace();
finishLine().then(() => console.log("all settled"));
console.log("script end");
