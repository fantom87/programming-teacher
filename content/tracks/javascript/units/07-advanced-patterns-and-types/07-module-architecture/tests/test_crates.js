test("addRecord returns a NEW crate and leaves the old one alone", () => {
  const before = [];
  const after = addRecord(before, "Test Pressing", 30);
  expect(after.length).toBe(1);
  expect(before.length).toBe(0);
  expect(after[0]).toEqual({ title: "Test Pressing", minutes: 30 });
});

test("totalMinutes sums the whole crate", () => {
  const crate = [
    { title: "a", minutes: 10 },
    { title: "b", minutes: 25 },
    { title: "c", minutes: 7 },
  ];
  expect(totalMinutes(crate)).toBe(42);
});

test("totalMinutes of an empty crate is 0", () => {
  expect(totalMinutes([])).toBe(0);
});

test("longest picks the record with the most minutes", () => {
  const crate = [
    { title: "short", minutes: 10 },
    { title: "epic", minutes: 25 },
    { title: "mid", minutes: 18 },
  ];
  expect(longest(crate).title).toBe("epic");
});
