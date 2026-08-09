// Test-first: the spec lives in tests/test_main.js — each test name is
// one requirement, implemented below in the same order.

// A general transform: strip what doesn't belong, then collapse
// whitespace runs into single dashes. Works on titles no test has met.
function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // punctuation out first...
    .replace(/\s+/g, "-"); // ...then spaces become single dashes
}

// Demo loop — leave as-is once slugify exists.
const TITLES = [
  "Getting Started with Vitest!",
  "  Why Tests Are a Spec  ",
  "Red, Green, Refactor",
];

for (const title of TITLES) {
  console.log(slugify(title));
}
