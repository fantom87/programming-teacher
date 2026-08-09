// JSON.parse returns `any` — today you put a lid on it with unknown.

// 1. describeValue(value: unknown): string
//    string  -> `string of length ${value.length}`
//    number  -> `number ${value}`
//    boolean -> `boolean ${value}`
//    else    -> "mystery value"

// 2. fail(message: string): never — throws new Error(message).

// 3. requireString(value: unknown): string — returns the string,
//    or calls fail(`expected a string, got ${typeof value}`).

// 4. Then uncomment:
// console.log(describeValue(JSON.parse('"hello"')));
// console.log(describeValue(JSON.parse("42")));
// console.log(describeValue(JSON.parse("true")));
// console.log(describeValue(JSON.parse("[1, 2, 3]")));
// console.log(requireString(JSON.parse('"quiet"')).toUpperCase());
