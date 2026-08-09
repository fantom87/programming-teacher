const dice = [4, 6, 1, 3];

const party = [
  { name: "Ada", score: 120 },
  { name: "Sam", score: 80 },
  { name: "Rin", score: 50 },
];

const sum = (numbers) => numbers.reduce((total, n) => total + n, 0);

const totalScore = (players) =>
  players.reduce((total, player) => total + player.score, 0);

console.log(sum(dice));
console.log(totalScore(party));
