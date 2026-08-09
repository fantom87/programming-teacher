# Generics

Generics let one function or struct work across many types — without giving up compile-time checking, and without costing anything at runtime.

## A generic function

```rust
fn largest<T: PartialOrd>(items: &[T]) -> &T {
    let mut biggest = &items[0];
    for item in items {
        if item > biggest {
            biggest = item;
        }
    }
    biggest
}

fn main() {
    println!("{}", largest(&[3, 7, 2]));            // 7
    println!("{}", largest(&["pear", "apple"]));    // pear
    println!("{}", largest(&[2.5, 9.1, 4.4]));      // 9.1
}
```

`<T>` declares a type parameter. The **trait bound** `T: PartialOrd` is the crucial part: it promises `T` can be compared with `>`, which is exactly what the body needs. Rust checks generic code against its bounds — not against each call site — so mistakes surface in the generic function itself, with a clear message.

## Generic structs

```rust
#[derive(Debug)]
struct Pair<T> {
    first: T,
    second: T,
}

fn main() {
    let numbers = Pair { first: 1, second: 2 };      // Pair<i32>, inferred
    let words = Pair { first: "a", second: "b" };    // Pair<&str>
    println!("{numbers:?} {words:?}");
}
```

`Option<T>`, `Vec<T>`, `Result<T, E>` — you've been using generic types since page one.

## where clauses and multiple bounds

Bounds stack with `+`, and `where` keeps busy signatures readable:

```rust
use std::fmt::Display;

fn show_all<T>(items: &[T])
where
    T: Display + Clone,
{
    for item in items {
        println!("{item}");
    }
}
```

## impl Trait: the lightweight spelling

For simple cases, `impl Trait` reads more naturally than `<T: Trait>`:

```rust
use std::fmt::Display;

fn announce(item: &impl Display) {
    println!("*** {item} ***");
}
```

It also works as a *return* type — handy for iterators and closures whose exact types are unwritable.

## Monomorphization: why generics are free

At compile time, Rust stamps out a separate, fully concrete copy of `largest` for each type you actually use — one for `i32`, one for `&str` — then optimizes each like hand-written code. Generic code runs exactly as fast as the specialized versions you didn't have to write. "Zero-cost abstraction" isn't a slogan; it's the compilation strategy.

Traits give you the vocabulary of behavior; generics let you write with it once, for every type that qualifies.
