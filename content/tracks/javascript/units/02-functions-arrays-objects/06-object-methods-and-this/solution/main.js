const hero = {
  name: "Ada",
  score: 0,
  describe() {
    return `${this.name} has ${this.score} points`;
  },
  addPoints(points) {
    this.score = this.score + points;
  },
};

hero.addPoints(25);
hero.addPoints(25);

console.log(hero.describe());
