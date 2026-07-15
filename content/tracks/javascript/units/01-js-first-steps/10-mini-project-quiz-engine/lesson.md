---
id: 10-mini-project-quiz-engine
title: "Mini-Project: Quiz Engine"
language: javascript
runner: browser
estMinutes: 25
files:
  - path: main.js
    starter: starter/main.js
goal: "Write gradeAnswer(correct, given) returning a strict-equality boolean, and scoreQuiz(questions) that loops the array calling gradeAnswer and returns the count of right answers."
docs: [javascript/functions-and-closures, javascript/arrays, javascript/loops]
checks:
  - id: quiz-functions-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: uses-functions-and-loop
    type: ai-judge
    rubric: "Defines gradeAnswer and scoreQuiz as functions. scoreQuiz loops over the questions array (for, for...of, or while) and calls gradeAnswer for each item, accumulating a count that it returns. The score must be computed by the loop — not hardcoded (e.g. return 2) and not derived without calling gradeAnswer."
hints:
  - "gradeAnswer is one line: return correct === given; — a comparison already IS a boolean."
  - "scoreQuiz needs a counter starting at 0, a for...of loop over questions, and an if that adds 1 when gradeAnswer(q.answer, q.given) is true."
  - "The loop body: for (const q of questions) { if (gradeAnswer(q.answer, q.given)) { score = score + 1; } } — then return score after the loop."
---
## Your first engine

Time to combine the whole unit — functions, a loop, an array of objects,
strict equality, branching — into something that feels like real software:
a quiz grader.

The starter gives you a quiz: an array where each object has a `question`,
the correct `answer`, and the answer a student actually `given`:

```js
const quiz = [
  { question: "...", answer: "*", given: "*" },      // right
  { question: "...", answer: "const", given: "let" }, // wrong
  // ...
];
```

You'll build the engine as **two functions**, each with one job:

**`gradeAnswer(correct, given)`** — the smallest possible grader. Returns
`true` when the two match exactly (`===`), otherwise `false`. Remember: a
comparison already *is* a boolean, so this function can be a single
`return` line.

**`scoreQuiz(questions)`** — the manager. It takes *any* array of
question objects, loops over it, asks `gradeAnswer` about each one, counts
the `true`s, and **returns** the count. The pattern is one you've half-met
already: start a counter at 0, add to it inside a loop.

Why two functions instead of one big blob? Because each piece can be
tested, reused, and trusted separately — the checks will call your
functions with quizzes you've never seen, so no hardcoding the answer.
An AI reviewer also verifies the loop is doing the counting.

### Your goal

1. Write `gradeAnswer(correct, given)` — returns whether they match with `===`.
2. Write `scoreQuiz(questions)` — loops the array, calls `gradeAnswer` on
   each question's `answer` and `given`, returns how many were right.
3. Print `scoreQuiz(quiz)` — with the starter quiz, it should print `2`.
