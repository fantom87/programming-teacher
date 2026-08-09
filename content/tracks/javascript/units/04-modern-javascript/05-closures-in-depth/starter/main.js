// 1. makeBank(opening) — a private balance variable INSIDE the factory,
//    and RETURN an object with three methods sharing it:
//      deposit(amount)  — add, return the new balance
//      withdraw(amount) — if amount > balance return "declined" (and
//                         change nothing); otherwise subtract and
//                         return the new balance
//      balance()        — return it

// 2. Demo:
//    const savings = makeBank(100);
//    console.log(savings.deposit(50));    // 150
//    console.log(savings.withdraw(200));  // declined
//    console.log(savings.withdraw(30));   // 120

// 3. once(fn) — RETURN a wrapper that calls fn only the FIRST time
//    (forward its arguments!) and remembers the result; every later
//    call returns that same result without running fn again.

// 4. const boot = once(() => { console.log("igniting!"); return "engine on"; });
//    console.log(boot());
//    console.log(boot());
