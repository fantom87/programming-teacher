test("readValues maps ids to values", () => {
  expect(readValues(form)).toEqual({ username: "ada", email: "ada@example.com" });
});

test("readValues works on any form", () => {
  const login = {
    tag: "form", id: "login", classes: [],
    children: [
      { tag: "input", id: "user", value: "grace" },
      { tag: "input", id: "pass", value: "hopper123" },
    ],
  };
  expect(readValues(login)).toEqual({ user: "grace", pass: "hopper123" });
});

test("a valid signup has no errors", () => {
  expect(validateSignup({ username: "ada", email: "ada@example.com" })).toEqual([]);
});

test("an empty username is caught", () => {
  expect(validateSignup({ username: "", email: "a@b.com" })).toEqual(["username is required"]);
});

test("an email without @ is caught", () => {
  expect(validateSignup({ username: "ada", email: "nope" })).toEqual(["email must contain @"]);
});

test("both problems are reported together, username first", () => {
  expect(validateSignup({ username: "", email: "nope" }))
    .toEqual(["username is required", "email must contain @"]);
});
