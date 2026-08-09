// 1. class Book — constructor(title, pages) stores both on this;
//    describe() RETURNS `${this.title} (${this.pages} pages)`.

// 2. class Audiobook extends Book — constructor(title, pages, narrator)
//    calls super(title, pages), then stores the narrator;
//    describe() RETURNS `${super.describe()}, read by ${this.narrator}`.

// 3. The demo — uncomment once your classes exist:
// const dune = new Book("Dune", 412);
// const wyrd = new Audiobook("Wyrd Sisters", 265, "Nadia Cole");
// console.log(dune.describe());
// console.log(wyrd.describe());
// console.log(wyrd instanceof Book);
// console.log(dune.describe === Book.prototype.describe);
