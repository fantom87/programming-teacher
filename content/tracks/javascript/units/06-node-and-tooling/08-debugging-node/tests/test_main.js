test("parseItems tolerates a trailing newline", () => {
  expect(parseItems("espresso,2.00\n")).toEqual([
    { name: "espresso", price: 2 },
  ]);
});

test("parseItems skips blank lines anywhere", () => {
  expect(parseItems("a,1\n\nb,2\n").length).toBe(2);
});

test("prices are numbers, not strings", () => {
  expect(typeof parseItems("mocha,5.25\n")[0].price).toBe("number");
});

test("totalOf accumulates every price", () => {
  expect(totalOf([{ price: 2 }, { price: 3 }, { price: 4 }])).toBe(9);
});

test("totalOf of nothing is zero", () => {
  expect(totalOf([])).toBe(0);
});
