// Syntax sprint — three functions, checked hard.

// 1. kindOf(x) -> "null" / "array" / "nan" / typeof x. Always a string.
//    The gotchas go first: typeof null is "object", typeof [] is
//    "object", typeof NaN is "number".

// 2. row(name, price) -> ONE template literal:
//    name padded right to 8 columns | price padded left to 7, two decimals.

// 3. counters() -> an array of THREE functions built in one
//    for (let ...) loop, where counters()[i]() returns i.
//    Block scoping does the work.

// Drill — leave these prints exactly as they are:
console.log([null, [1, 2], NaN, "hi", 42, undefined].map(kindOf).join(" "));
console.log(row("coffee", 4.5));
console.log(row("keyboard", 89.999));
console.log(counters().map((f) => f()).join(" "));
