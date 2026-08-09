test("saved is a string", () => {
  expect(typeof saved).toBe("string");
});

test("saved round-trips back to the settings object", () => {
  expect(JSON.parse(saved)).toEqual({ theme: "dark", volume: 7, muted: false });
});

test("loaded is a real object with the player's name", () => {
  expect(loaded.player).toBe("Ada");
});

test("loaded.level is the NUMBER 12 (parse rebuilds types)", () => {
  expect(loaded.level).toBe(12);
});

test("loaded.inventory is a real array again", () => {
  expect(Array.isArray(loaded.inventory)).toBe(true);
  expect(loaded.inventory).toEqual(["rope", "lantern"]);
});
