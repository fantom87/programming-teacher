const DEFAULTS = { theme: "dark", fontSize: 14 };

const rin = { name: "Rin", city: "Osaka" };
const sol = { name: "Sol" };

const race = ["Ada", "Sam", "Kai", "Ivy", "Ben"];

// 1. introduce(person) — destructure { name, city } (city defaults to
//    "parts unknown") and RETURN `${name} from ${city}`.

// 2. podium(results) — destructure [gold, silver, ...rest] and RETURN
//    `gold ${gold}, silver ${silver}, ${rest.length} others`.

// 3. withDefaults(settings) — RETURN a NEW object: spread DEFAULTS,
//    then settings (later spreads win the ties).

// 4. Print introduce(rin), introduce(sol), podium(race),
//    and withDefaults({ fontSize: 16 }).
