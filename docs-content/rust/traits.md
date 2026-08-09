# Traits

A **trait** defines shared behavior — a set of methods a type can promise to provide. If you know interfaces from another language, you're close: traits are that idea, plus default methods, plus the ability to implement them for types you didn't write.

## Defining and implementing

```rust
trait Describe {
    fn describe(&self) -> String;

    fn shout(&self) -> String {              // default method — free for implementors
        self.describe().to_uppercase()
    }
}

struct Dog {
    name: String,
}

struct Robot {
    id: u32,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("{} the dog", self.name)
    }
}

impl Describe for Robot {
    fn describe(&self) -> String {
        format!("robot #{}", self.id)
    }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    println!("{}", d.describe());    // Rex the dog
    println!("{}", d.shout());       // REX THE DOG — the default, inherited
}
```

## Trait parameters

Functions can accept "anything that implements Describe":

```rust
fn introduce(item: &impl Describe) {
    println!("Meet {}", item.describe());
}
```

`introduce` works with dogs, robots, and any type that implements `Describe` next year — that's Rust's polymorphism (more on the generics page).

## Implementing standard traits: Display

The standard library speaks traits. Implement `Display` and your type plugs into `println!("{}")`:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    println!("{}", Point { x: 3, y: 4 });    // (3, 4)
}
```

The same pattern powers `PartialEq` (`==`), `Ord` (sorting), and `Iterator` (`for` loops) — the operators aren't magic, they're traits.

## derive: traits for free

Many common traits are mechanical, so the compiler writes them for you:

```rust
#[derive(Debug, Clone, PartialEq)]
struct Score {
    value: u32,
}
```

## dyn Trait: mixed collections

To store *different* types behind one trait, box them as **trait objects**:

```rust
let items: Vec<Box<dyn Describe>> = vec![
    Box::new(Dog { name: String::from("Rex") }),
    Box::new(Robot { id: 7 }),
];
for item in &items {
    println!("{}", item.describe());
}
```

`dyn Describe` means "some type implementing Describe, decided at runtime" — dynamic dispatch, used only when you need it.

Traits give behavior a name; generics — next page — let one piece of code serve every type that has it.
