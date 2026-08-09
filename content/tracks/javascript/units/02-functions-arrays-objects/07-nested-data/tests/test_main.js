test("secondMember is Sam (positions start at 0)", () => {
  expect(secondMember).toBe("Sam");
});

test("rinSkillCount counts Rin's three skills", () => {
  expect(rinSkillCount).toBe(3);
});

test("Sam's skills now include baking", () => {
  expect(guild.members[1].skills).toEqual(["cooking", "baking"]);
});

test("allNames collects every member's name", () => {
  expect(allNames).toEqual(["Ada", "Sam", "Rin"]);
});

test("the guild still has exactly three members", () => {
  expect(guild.members.length).toBe(3);
});
