// 1. makeCounter() — declare a count variable INSIDE it (start at 0),
//    and RETURN a function that adds 1 to count and returns the new value.

// 2. Prove two counters are independent:
//    const clicks = makeCounter();
//    const visits = makeCounter();
//    console.log(clicks());   // 1
//    console.log(clicks());   // 2
//    console.log(visits());   // 1  (its own private count!)

// 3. makeTagger(tag) — RETURN a function that takes a message and
//    returns `[${tag}] ${message}`.

// 4. const warn = makeTagger("WARN");
//    console.log(warn("low battery"));   // [WARN] low battery
