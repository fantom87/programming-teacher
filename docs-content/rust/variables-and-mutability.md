# Variables and mutability

Rust's first surprise: variables are **immutable by default**. If you want to change a value later, you must say so up front.

## let bindings

```rust
fn main() {
    let score = 10;
    println!("{score}");

    score = 20;    // error: cannot assign twice to immutable variable
}
```

The compiler rejects that last line — and tells you exactly what to do about it:

```text
error[E0384]: cannot assign twice to immutable variable `score`
help: consider making this binding mutable: `mut score`
```

## mut opts in to change

```rust
fn main() {
    let mut score = 10;
    score = 20;             // fine — we declared our intentions
    println!("{score}");    // 20
}
```

This default is a feature, not a hurdle. Most values never need to change, and when you read `let` you *know* it won't — anything mutable announces itself with `mut`.

## Shadowing: a new variable, same name

You can declare a *new* variable that reuses an old name — even with a different type:

```rust
fn main() {
    let spaces = "   ";           // a string
    let spaces = spaces.len();    // now a number — a brand-new variable
    println!("{spaces}");         // 3
}
```

That's not mutation — the old `spaces` is simply replaced from that line on. Shadowing shines in "parse, then use" pipelines, where the raw input and the parsed value deserve the same name.

## Constants

```rust
const MAX_PLAYERS: u32 = 4;
```

Constants require a type annotation, use `SCREAMING_SNAKE_CASE`, can live outside functions, and must be computable at compile time.

## Which to reach for?

- `let` — the default, for values that never change
- `let mut` — when a value genuinely must be updated in place
- shadowing — when a value transforms into its next form
- `const` — program-wide fixed numbers and strings

Immutability-first is your first taste of Rust's philosophy: make the safe thing the easy thing.
