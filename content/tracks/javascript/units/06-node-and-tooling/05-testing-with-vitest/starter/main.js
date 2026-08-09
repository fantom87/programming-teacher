// Test-first: the spec lives in tests/test_main.js. Read it, then build
// slugify(title) until every requirement is green.
//
// In a Vitest project this file would be slugify.js, the suite would be
// slugify.test.js, and `npx vitest` would rerun it on every save.

// slugify(title) — implement here.

// Demo loop — leave as-is once slugify exists.
const TITLES = [
  "Getting Started with Vitest!",
  "  Why Tests Are a Spec  ",
  "Red, Green, Refactor",
];

for (const title of TITLES) {
  console.log(slugify(title));
}
