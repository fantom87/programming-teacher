# Program structure

Rust is a compiled language with a reputation: strict compiler, fearless programs. **Cargo** — its build tool and package manager — is with you from minute one.

## Hello, Cargo

```bash
cargo new hello
cd hello
cargo run
```

`cargo new` scaffolds a project:

```
hello/
├── Cargo.toml    # project file: name, version, dependencies
└── src/
    └── main.rs   # your code
```

```rust
// src/main.rs
fn main() {
    println!("Hello, world!");
}
```

`fn main()` is where execution starts. `cargo run` compiles and runs; `cargo build` just compiles; `cargo check` type-checks without producing a binary — the fast feedback loop you'll live in.

## That ! matters

`println!` is a **macro**, not a function — that's what the `!` marks. Macros can do things functions can't, like checking your format string at compile time:

```rust
fn main() {
    let name = "Ada";
    println!("Hello, {name}!");         // variables drop straight into {}
    println!("{} + {} = {}", 2, 2, 4);  // or positionally
}
```

You'll meet a handful of macros early — `println!`, `format!`, `vec!`, `dbg!` — long before you ever write one.

## Statements, blocks, and semicolons

Statements end with `;` and blocks live in `{ }`:

```rust
fn main() {
    let message = "compiling...";
    if message.contains("compiling") {
        println!("patience.");
    }
}
```

(A Rust signature move: blocks can *produce values* — more on that soon.)

## Comments

```rust
// single line
/* multiple
   lines */
/// documentation comment — powers `cargo doc`
```

## The compiler is the curriculum

Rust's error messages are the best in the business — they quote your code, point at the problem, and usually suggest the fix. Reading them carefully *is* learning Rust, and the borrow checker will make sure you get plenty of practice.

A `Cargo.toml`, a `src/main.rs`, and `cargo run` — that's every Rust program's starting shape.
