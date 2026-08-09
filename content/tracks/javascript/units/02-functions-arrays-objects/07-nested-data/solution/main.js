const guild = {
  name: "Night Owls",
  members: [
    { name: "Ada", skills: ["archery", "maps"] },
    { name: "Sam", skills: ["cooking"] },
    { name: "Rin", skills: ["climbing", "first aid", "maps"] },
  ],
};

const secondMember = guild.members[1].name;
const rinSkillCount = guild.members[2].skills.length;

guild.members[1].skills.push("baking");

const allNames = guild.members.map((member) => member.name);

console.log(secondMember);
console.log(rinSkillCount);
console.log(allNames.join(", "));
