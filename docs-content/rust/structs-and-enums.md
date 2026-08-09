# Structs and enums

Rust models data with two complementary tools: **structs** bundle fields together ("this AND that"), **enums** offer alternatives ("this OR that"). Most Rust programs are largely these two, composed.

## Structs

```rust
#[derive(Debug)]
struct Account {
    owner: String,
    balance: f64,
}

fn main() {
    let mut acct = Account {
        owner: String::from("Ada"),
        balance: 10.0,
    };

    acct.balance += 5.0;
    println!("{} has ${}", acct.owner, acct.balance);
    println!("{acct:?}");    // Account { owner: "Ada", balance: 15.0 }
}
```

Mutability is all-or-nothing: `let mut` makes every field changeable. `#[derive(Debug)]` auto-writes the code that lets `{:?}` print the struct — you'll put it on nearly everything, often alongside friends like `Clone` and `PartialEq`.

## Methods live in impl blocks

```rust
impl Account {
    fn new(owner: &str) -> Account {           // associated function — no self
        Account { owner: owner.to_string(), balance: 0.0 }
    }

    fn describe(&self) -> String {             // &self borrows — reads
        format!("{} has ${}", self.owner, self.balance)
    }

    fn deposit(&mut self, amount: f64) {       // &mut self — modifies
        self.balance += amount;
    }
}

fn main() {
    let mut acct = Account::new("Ada");
    acct.deposit(15.0);
    println!("{}", acct.describe());    // Ada has $15
}
```

The receiver tells the story: `&self` reads, `&mut self` writes, plain `self` consumes. `Account::new` is the constructor convention — just an ordinary function, called with `::`.

## Enums: alternatives that carry data

Rust enums go far beyond named constants — each variant can hold its own data:

```rust
#[derive(Debug)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Point,
}

fn main() {
    let shapes = vec![
        Shape::Circle { radius: 1.0 },
        Shape::Rectangle { width: 2.0, height: 3.0 },
        Shape::Point,
    ];
    println!("{shapes:?}");
}
```

A `Shape` is *exactly one* of those three — the type system won't let a rectangle have a radius. Impossible states become unrepresentable, which deletes whole categories of validation code.

The most famous enum lives in the standard library: `Option<T>` is just `Some(T)` or `None` — Rust's replacement for null. Getting data *out* of an enum is the job of `match` — next page.
