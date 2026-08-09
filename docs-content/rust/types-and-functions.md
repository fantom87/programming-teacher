# Types and functions

Rust is statically typed but rarely makes you write types — inference fills in most of them. When you do write one, it goes after a colon: `x: i32`.

## Scalar types

```rust
fn main() {
    let count: i32 = -7;         // 32-bit signed integer — the default
    let big: u64 = 1_000_000;    // unsigned; underscores are just for reading
    let price: f64 = 9.99;       // 64-bit float — the default
    let ready: bool = true;
    let letter: char = 'å';      // a Unicode character, in single quotes

    println!("{count} {big} {price} {ready} {letter}");
}
```

Integers come in sizes (`i8` through `i128`, unsigned `u8` through `u128`) plus `usize` — the type used for indexing collections. Rust never converts numeric types silently; `as` makes it explicit:

```rust
let x: i32 = 7;
let y: f64 = x as f64;    // explicit, always
```

## Tuples and arrays

```rust
let point: (i32, i32) = (3, 4);
let (x, y) = point;                 // destructure
println!("{} {}", point.0, y);      // 3 4

let days = ["Mon", "Tue", "Wed"];   // fixed-size array: [&str; 3]
println!("{}", days[0]);            // Mon
```

## Functions

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("{}", add(2, 3));    // 5
}
```

Parameter types are required; the return type follows `->`. And notice `a + b` has **no semicolon** — that's not sloppiness, it's the point.

## Expressions vs statements

Almost everything in Rust is an **expression** — it produces a value. A block's final expression, left without a semicolon, becomes the block's value:

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1           // no semicolon: this block evaluates to 4
    };
    println!("{y}");    // 4
}
```

Add a semicolon and the expression becomes a statement producing `()` — the source of the classic "expected `i32`, found `()`" error when a function's last line accidentally ends in `;`. `return` exists for early exits; the idiomatic final line is a bare expression.

That "everything is an expression" idea powers `if` too — next page.
