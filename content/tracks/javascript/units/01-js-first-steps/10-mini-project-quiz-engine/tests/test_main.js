test("gradeAnswer returns true for an exact match", () => {
  expect(gradeAnswer("4", "4")).toBe(true);
});

test("gradeAnswer returns false for a wrong answer", () => {
  expect(gradeAnswer("4", "5")).toBe(false);
});

test("gradeAnswer uses strict equality (no type conversion)", () => {
  expect(gradeAnswer("4", 4)).toBe(false);
});

test("scoreQuiz counts correct answers on a new quiz", () => {
  const sample = [
    { question: "a", answer: "1", given: "1" },
    { question: "b", answer: "2", given: "9" },
    { question: "c", answer: "3", given: "3" },
    { question: "d", answer: "4", given: "4" },
  ];
  expect(scoreQuiz(sample)).toBe(3);
});

test("scoreQuiz returns 0 for an empty quiz", () => {
  expect(scoreQuiz([])).toBe(0);
});

test("the starter quiz scores 2", () => {
  expect(scoreQuiz(quiz)).toBe(2);
});
