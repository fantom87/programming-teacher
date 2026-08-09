// Inputs hold whatever the user typed in .value — and it's ALWAYS a string.
const form = {
  tag: "form", id: "signup", classes: [],
  children: [
    { tag: "input", id: "username", value: "ada" },
    { tag: "input", id: "email", value: "ada@example.com" },
  ],
};

// 1. readValues(form) — RETURN an object mapping each child input's id to
//    its value. For the form above:
//    { username: "ada", email: "ada@example.com" }

// 2. validateSignup(values) — RETURN an array of error messages, checked
//    in this order:
//    - values.username is ""            → "username is required"
//    - values.email has no "@" in it    → "email must contain @"
//    A good form returns [].

// 3. Try it:
//    console.log(validateSignup(readValues(form)));            // []
//    console.log(validateSignup({ username: "", email: "nope" }));
//    // [ 'username is required', 'email must contain @' ]
