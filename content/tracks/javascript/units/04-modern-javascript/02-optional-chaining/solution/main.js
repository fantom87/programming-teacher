const ada = { name: "Ada", address: { city: "London" } };
const drifter = { name: "Drifter" };

const post1 = { title: "Hello", tags: ["javascript", "intro"] };
const post2 = { title: "Untitled" };

const veteran = { name: "Vex", score: 0 };
const rookie = { name: "Nia" };

function cityOf(user) {
  return user?.address?.city ?? "unknown";
}

function firstTag(post) {
  return post.tags?.[0] ?? "untagged";
}

function scoreLine(player) {
  return `score: ${player.score ?? "n/a"}`;
}

console.log(cityOf(ada));
console.log(cityOf(drifter));
console.log(firstTag(post1));
console.log(firstTag(post2));
console.log(scoreLine(veteran));
console.log(scoreLine(rookie));
