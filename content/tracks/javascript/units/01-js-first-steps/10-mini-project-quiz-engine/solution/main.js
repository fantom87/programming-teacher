const quiz = [
  { question: "Which symbol multiplies?", answer: "*", given: "*" },
  { question: "Which keyword makes an unchangeable variable?", answer: "const", given: "let" },
  { question: "What is 2 + 2?", answer: "4", given: "4" },
];

function gradeAnswer(correct, given) {
  return correct === given;
}

function scoreQuiz(questions) {
  let score = 0;
  for (const q of questions) {
    if (gradeAnswer(q.answer, q.given)) {
      score = score + 1;
    }
  }
  return score;
}

console.log(scoreQuiz(quiz));
