test("introduce unpacks name and city", () => {
  expect(introduce({ name: "Kai", city: "Reno" })).toBe("Kai from Reno");
});

test("a missing city falls back to the default", () => {
  expect(introduce({ name: "Ivy" })).toBe("Ivy from parts unknown");
});

test("podium splits the winners from the rest", () => {
  expect(podium(["a", "b", "c", "d"])).toBe("gold a, silver b, 2 others");
});

test("rest is a real (possibly empty) array", () => {
  expect(podium(["a", "b"])).toBe("gold a, silver b, 0 others");
});

test("withDefaults fills every gap", () => {
  expect(withDefaults({})).toEqual({ theme: "dark", fontSize: 14 });
});

test("caller settings win over defaults", () => {
  expect(withDefaults({ theme: "light" })).toEqual({ theme: "light", fontSize: 14 });
});

test("DEFAULTS itself is never modified", () => {
  withDefaults({ theme: "light", fontSize: 99 });
  expect(DEFAULTS).toEqual({ theme: "dark", fontSize: 14 });
});
