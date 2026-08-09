// Inputs hold whatever the user typed in .value — and it's ALWAYS a string.
const form = {
  tag: "form", id: "signup", classes: [],
  children: [
    { tag: "input", id: "username", value: "ada" },
    { tag: "input", id: "email", value: "ada@example.com" },
  ],
};

function readValues(form) {
  const values = {};
  for (const input of form.children) {
    values[input.id] = input.value;
  }
  return values;
}

function validateSignup(values) {
  const errors = [];
  if (values.username === "") {
    errors.push("username is required");
  }
  if (!values.email.includes("@")) {
    errors.push("email must contain @");
  }
  return errors;
}

console.log(validateSignup(readValues(form)));
console.log(validateSignup({ username: "", email: "nope" }));
