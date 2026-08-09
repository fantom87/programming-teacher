test("kindOf nails the gotchas", () => {
  expect(kindOf(null)).toBe("null");
  expect(kindOf([])).toBe("array");
  expect(kindOf(NaN)).toBe("nan");
  expect(kindOf("hi")).toBe("string");
  expect(kindOf(0)).toBe("number");
  expect(kindOf(undefined)).toBe("undefined");
});

test("row aligns with pad and toFixed", () => {
  expect(row("x", 0)).toBe("x       |   0.00");
  expect(row("keyboard", 89.999)).toBe("keyboard|  90.00");
  expect(row("x", 0).indexOf("|")).toBe(8);
});

test("counters closes over a fresh binding each turn", () => {
  const fns = counters();
  expect(fns.length).toBe(3);
  expect(fns.map((f) => f()).join(" ")).toBe("0 1 2");
  expect(fns[2]()).toBe(2);
});
