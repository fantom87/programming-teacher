# Pattern matching

`match` compares a value against patterns and runs the first arm that fits. It's `switch` with superpowers — it destructures data, and the compiler guarantees you handled every case.

## The basics

```rust
fn main() {
    let roll = 4;

    let outcome = match roll {
        1 => "critical fail",
        2..=4 => "meh",              // range pattern
        5 => "nice",
        _ => "critical success",     // _ catches everything else
    };
    println!("{outcome}");           // meh
}
```

`match` is an expression — arms produce values. Remove the `_` arm and the compiler refuses to build: `non-exhaustive patterns`. That's **exhaustiveness checking**, and it's the whole feature: forget a case and your code doesn't compile.

## Destructuring enums

Here's where `match` earns its keep — pulling the data out of enum variants:

```rust
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Point,
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => 3.14159 * radius * radius,
        Shape::Rectangle { width, height } => width * height,
        Shape::Point => 0.0,
    }
}
```

Each arm names the variant *and* binds its fields in one motion. Add a `Triangle` variant next month and every `match` on `Shape` fails to compile until it's handled — the compiler hands you the to-do list.

## Matching Option

```rust
fn main() {
    let numbers = vec![1, 2, 3];

    match numbers.first() {
        Some(n) => println!("first: {n}"),
        None => println!("empty vec"),
    }
}
```

No null checks to forget — the type forces the question, and `match` answers it.

## if let: when one case matters

A full `match` for a single interesting pattern is noisy. `if let` handles just that one:

```rust
if let Some(n) = numbers.first() {
    println!("first: {n}");
}
```

## let else: bind or bail

```rust
fn describe(numbers: &[i32]) -> String {
    let Some(first) = numbers.first() else {
        return String::from("empty");
    };
    format!("starts with {first}")
}
```

`let else` binds the happy path or takes the early exit — flattening the nesting that stacked `if let`s create.

Patterns appear all over Rust — `let (x, y) = pair;` is one too. But `match` plus enums is the daily combination: model states as variants, then let exhaustiveness keep every handler honest.
