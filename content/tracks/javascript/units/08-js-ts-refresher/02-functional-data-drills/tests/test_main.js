test("revenue reduces with a zero seed", () => {
  expect(revenue(orders)).toBe(344);
  expect(revenue([])).toBe(0);
});

test("unshipped chains filter and map", () => {
  expect(unshipped(orders)).toEqual(["mouse", "cable"]);
  expect(unshipped([])).toEqual([]);
});

test("byId builds a lookup object", () => {
  expect(byId(orders)[2].item).toBe("mouse");
  expect(byId(orders)[4].qty).toBe(3);
  expect(byId([])).toEqual({});
});

test("topByValue ranks without mutating", () => {
  expect(topByValue(orders, 2)).toEqual(["monitor", "keyboard"]);
  expect(topByValue(orders, 1)).toEqual(["monitor"]);
  expect(orders.map((o) => o.id).join("")).toBe("1234");
});
