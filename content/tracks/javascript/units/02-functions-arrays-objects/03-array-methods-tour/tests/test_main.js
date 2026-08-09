test("hasRope is true (includes found the rope)", () => {
  expect(hasRope).toBe(true);
});

test("mapSpot is 1 (indexOf counts from 0)", () => {
  expect(mapSpot).toBe(1);
});

test("firstThree holds the first three items", () => {
  expect(firstThree).toEqual(["sword", "map", "rope"]);
});

test("slice COPIED — the inventory still has all five items", () => {
  expect(inventory).toEqual(["sword", "map", "rope", "lantern", "coin"]);
});

test("packed is one string glued with \" | \"", () => {
  expect(packed).toBe("sword | map | rope | lantern | coin");
});
