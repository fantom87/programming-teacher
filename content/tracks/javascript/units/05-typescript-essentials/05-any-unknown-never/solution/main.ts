function describeValue(value: unknown): string {
  if (typeof value === "string") return `string of length ${value.length}`;
  if (typeof value === "number") return `number ${value}`;
  if (typeof value === "boolean") return `boolean ${value}`;
  return "mystery value";
}

function fail(message: string): never {
  throw new Error(message);
}

function requireString(value: unknown): string {
  if (typeof value === "string") return value;
  fail(`expected a string, got ${typeof value}`);
}

console.log(describeValue(JSON.parse('"hello"')));
console.log(describeValue(JSON.parse("42")));
console.log(describeValue(JSON.parse("true")));
console.log(describeValue(JSON.parse("[1, 2, 3]")));
console.log(requireString(JSON.parse('"quiet"')).toUpperCase());
