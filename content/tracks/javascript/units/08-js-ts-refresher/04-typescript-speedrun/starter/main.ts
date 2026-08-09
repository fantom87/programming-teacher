// TypeScript speedrun — annotate, narrow, generify. No any anywhere.

// 1. interface Player — name: string, score: number, badge?: string.
//    describePlayer(p: Player): string ->
//    "Ada — 120 [pro]" with a badge, "Lin — 80" without.

// 2. type Shape — a discriminated union on kind:
//    { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number }
//    area(shape: Shape): number — switch on shape.kind; in the default,
//    assign shape to a never-typed binding (the exhaustiveness net).

// 3. firstOr<T>(items: T[], fallback: T): T — the first element, or the
//    fallback when the array is empty. One T ties input to output.

// Drill — leave these prints exactly as they are:
console.log(describePlayer({ name: "Ada", score: 120, badge: "pro" }));
console.log(describePlayer({ name: "Lin", score: 80 }));
console.log(area({ kind: "circle", r: 2 }).toFixed(2));
console.log(area({ kind: "rect", w: 3, h: 4 }).toFixed(2));
console.log(firstOr(["a", "b"], "?"));
console.log(firstOr([], "empty"));
