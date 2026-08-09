class Book {
  constructor(title, pages) {
    this.title = title;
    this.pages = pages;
  }

  describe() {
    return `${this.title} (${this.pages} pages)`;
  }
}

class Audiobook extends Book {
  constructor(title, pages, narrator) {
    super(title, pages);
    this.narrator = narrator;
  }

  describe() {
    return `${super.describe()}, read by ${this.narrator}`;
  }
}

const dune = new Book("Dune", 412);
const wyrd = new Audiobook("Wyrd Sisters", 265, "Nadia Cole");
console.log(dune.describe());
console.log(wyrd.describe());
console.log(wyrd instanceof Book);
console.log(dune.describe === Book.prototype.describe);
