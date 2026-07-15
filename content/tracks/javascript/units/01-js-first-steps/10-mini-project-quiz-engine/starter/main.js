const quiz = [
  { question: "Which symbol multiplies?", answer: "*", given: "*" },
  { question: "Which keyword makes an unchangeable variable?", answer: "const", given: "let" },
  { question: "What is 2 + 2?", answer: "4", given: "4" },
];

// 1. gradeAnswer(correct, given) — RETURN true when they match exactly (===).

// 2. scoreQuiz(questions) — loop over the array, call gradeAnswer on each
//    question's answer and given, and RETURN how many were right.

// 3. Print the result:
//    console.log(scoreQuiz(quiz));   // should print 2
