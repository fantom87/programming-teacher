const learner: string = "Ada";
const streak: number = 12;

function describeStreak(name: string, days: number): string {
  return `${name} has a ${days}-day streak`;
}

const motto = "TypeScript is JavaScript with types";

console.log(describeStreak(learner, streak));
console.log(motto);
