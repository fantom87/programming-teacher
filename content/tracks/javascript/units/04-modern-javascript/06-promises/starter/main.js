// The café: drinks take time, but the shop never freezes.

// 1. wait(ms) — RETURN a new Promise that fulfills after ms milliseconds.
//    (Wrap setTimeout — resolve IS the timer's callback.)

// 2. brew(drink, ms) — RETURN wait(ms).then(...) producing `${drink} ready`.

// 3. Print "order: latte", then chain brew("latte", 120):
//      first .then  — print the ready message, RETURN "have a great day!"
//      second .then — print what arrived
//    (Keep timers at 200ms or less — the runner collects async output
//    only briefly after the file finishes.)

// 4. LAST line of the file: print "(register is free)" — then run it
//    and look at where that line lands.
