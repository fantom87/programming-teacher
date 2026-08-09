test("detectRuntime says node here", () => {
  expect(detectRuntime()).toBe("node");
});

test("no args reports none", () => {
  expect(describeArgs([])).toBe("args: none");
});

test("one arg is counted and listed", () => {
  expect(describeArgs(["build"])).toBe("args (1): build");
});

test("several args are comma-joined", () => {
  expect(describeArgs(["deploy", "--fast", "eu-west"])).toBe(
    "args (3): deploy, --fast, eu-west",
  );
});
