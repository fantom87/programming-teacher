// One function, every element type — that's what <T> buys you.

// 1. first<T>(items: T[]): T | undefined — returns items[0].

// 2. longest<T extends { length: number }>(a: T, b: T): T
//    Returns whichever argument has the greater .length.

// 3. Then uncomment:
// console.log(first([9, 8, 7]));
// console.log(first(["ember", "ash"]));
// console.log(longest("Type", "TypeScript"));
// console.log(longest([1, 2], [1, 2, 3]).length);
