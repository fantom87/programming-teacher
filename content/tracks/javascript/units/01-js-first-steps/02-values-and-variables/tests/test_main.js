test("name holds a non-empty string", () => {
  expect(typeof name).toBe("string");
  expect(name.length > 0).toBe(true);
});

test("name is declared with let — reassigning it works", () => {
  name = name; // a const (or missing) name would throw here
  expect(typeof name).toBe("string");
});

test("birthYear holds a 4-digit number", () => {
  expect(typeof birthYear).toBe("number");
  expect(/^\d{4}$/.test(String(birthYear))).toBe(true);
});

test("birthYear is a const — reassigning it fails", () => {
  expect(typeof birthYear).toBe("number");
  let threw = false;
  try {
    birthYear = birthYear;
  } catch (e) {
    threw = true;
  }
  expect(threw).toBe(true);
});

test("the printed lines show two different names", () => {
  // Re-run main.js with console.log captured to inspect what it prints.
  // The browser preview has no file access — the server check verifies this.
  if (typeof require !== "function") return;
  const source = require("fs").readFileSync("main.js", "utf8");
  const captured = [];
  const realLog = console.log;
  console.log = (...args) => {
    captured.push(args.map(String).join(" "));
  };
  try {
    new Function(source)();
  } finally {
    console.log = realLog;
  }
  const lines = captured
    .join("\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  expect(lines.length).toBe(3);
  expect(lines[0] === lines[2]).toBe(false);
});
