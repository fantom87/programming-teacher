function first<T>(items: T[]): T | undefined {
  return items[0];
}

function longest<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a;
}

console.log(first([9, 8, 7]));
console.log(first(["ember", "ash"]));
console.log(longest("Type", "TypeScript"));
console.log(longest([1, 2], [1, 2, 3]).length);
