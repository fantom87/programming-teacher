const DEFAULTS = { theme: "dark", fontSize: 14 };

const rin = { name: "Rin", city: "Osaka" };
const sol = { name: "Sol" };

const race = ["Ada", "Sam", "Kai", "Ivy", "Ben"];

function introduce(person) {
  const { name, city = "parts unknown" } = person;
  return `${name} from ${city}`;
}

function podium(results) {
  const [gold, silver, ...rest] = results;
  return `gold ${gold}, silver ${silver}, ${rest.length} others`;
}

function withDefaults(settings) {
  return { ...DEFAULTS, ...settings };
}

console.log(introduce(rin));
console.log(introduce(sol));
console.log(podium(race));
console.log(withDefaults({ fontSize: 16 }));
