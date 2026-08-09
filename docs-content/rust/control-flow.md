# Control flow

Rust's control flow looks familiar — `if`, `while`, `for` — with one twist that changes everything: most of it produces *values*.

## if — and if as an expression

No parentheses needed, and the condition must be a real `bool` (no truthy numbers):

```rust
fn main() {
    let score = 87;

    if score >= 90 {
        println!("A");
    } else if score >= 80 {
        println!("B");    // prints
    } else {
        println!("keep going");
    }

    let grade = if score >= 80 { "pass" } else { "fail" };
    println!("{grade}");  // pass
}
```

That last form replaces the ternary operator — both branches must produce the same type.

## loop — and break with a value

`loop` repeats forever until `break`. Uniquely, `break` can carry a result out:

```rust
fn main() {
    let mut attempts = 0;
    let found = loop {
        attempts += 1;
        if attempts * 7 > 40 {
            break attempts * 7;    // the loop evaluates to this
        }
    };
    println!("{found}");           // 42
}
```

## while

```rust
fn main() {
    let mut fuel = 3;
    while fuel > 0 {
        println!("{fuel}...");
        fuel -= 1;
    }
    println!("liftoff!");
}
```

## for and ranges

`for` iterates over anything iterable — most often a **range** or a collection:

```rust
fn main() {
    for i in 0..3 {
        println!("{i}");    // 0 1 2 — the end is exclusive
    }
    for i in 1..=3 {
        println!("{i}");    // 1 2 3 — ..= includes the end
    }

    let days = ["Mon", "Tue", "Wed"];
    for day in days {
        println!("{day}");
    }
}
```

There's no C-style `for (i = 0; ...)` — ranges cover it, without the off-by-one bugs. `continue` skips ahead, `break` exits, and both work in all three loops.

The real power tool for control flow, though, is `match` — it gets its own page once you've met enums.
