# Modules and Cargo

One file stops scaling fast. Rust organizes code with **modules** (namespaces within your project) and **crates** (the unit Cargo builds and shares).

## Modules and pub

```rust
mod greetings {
    pub fn hello(name: &str) -> String {
        format!("{}{}", prefix(), name)
    }

    fn prefix() -> String {           // private: no pub
        String::from("Hello, ")
    }
}

fn main() {
    println!("{}", greetings::hello("Ada"));    // Hello, Ada
    // greetings::prefix();                     // error: function is private
}
```

Everything is private by default; `pub` opens it up. Modules nest, forming a tree rooted at the crate.

## Splitting into files

Declare the module; put its body in a matching file:

```rust
// src/main.rs
mod greetings;    // loads src/greetings.rs

fn main() {
    println!("{}", greetings::hello("Ada"));
}
```

`use` shortens long paths:

```rust
use std::collections::HashMap;    // now HashMap::new(), no full path needed
use crate::greetings::hello;      // same for your own modules
```

## Cargo.toml and dependencies

Add libraries from **crates.io**, the community registry:

```bash
cargo add rand
```

```toml
# Cargo.toml
[dependencies]
rand = "0.8"
```

```rust
use rand::Rng;

fn main() {
    let n: u32 = rand::thread_rng().gen_range(1..=100);
    println!("{n}");
}
```

Cargo downloads the crate, locks the exact version in `Cargo.lock`, and rebuilds — one command, reproducible everywhere.

## The toolbox

- `cargo fmt` — the official formatter; ends style debates
- `cargo clippy` — the lint collection; teaches idiomatic Rust while it nags
- `cargo doc --open` — builds browsable docs for your code *and* every dependency
- `cargo test` — runs every `#[test]` function:

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_adds() {
        assert_eq!(2 + 2, 4);
    }
}
```

## Binary vs library

`src/main.rs` makes a binary crate; `src/lib.rs` makes a library — a project can have both, with the binary calling the library. That's the standard shape for a CLI tool: logic in the library (easy to test), a thin `main` on top.

Small modules, private by default, one polished toolchain — Rust project structure has one way to do things, and it's a good one.
