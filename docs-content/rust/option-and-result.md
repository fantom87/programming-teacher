# Option and Result

Rust has no null and no exceptions. In their place: two enums. `Option<T>` says "maybe absent," `Result<T, E>` says "maybe failed" — and both force the question at compile time.

## Option<T>: a value, or not

```rust
enum Option<T> {
    Some(T),
    None,
}
```

That's the actual definition — not compiler magic, just an enum. Anything that might be absent returns one:

```rust
fn main() {
    let numbers = vec![1, 2, 3];

    let first: Option<&i32> = numbers.first();
    match first {
        Some(n) => println!("first: {n}"),
        None => println!("empty"),
    }

    let doubled = numbers.first().map(|n| n * 2);    // transform, staying inside
    println!("{doubled:?}");                         // Some(2)

    let fallback = numbers.get(10).unwrap_or(&0);    // provide a default
    println!("{fallback}");                          // 0
}
```

You can't use an `Option<i32>` where an `i32` is needed — the compiler makes you unpack it, which means the `None` case is *always* handled somewhere.

## Result<T, E>: success or failure

```rust
fn main() {
    let parsed: Result<i32, _> = "42".parse();

    match parsed {
        Ok(n) => println!("got {n}"),
        Err(e) => println!("parse failed: {e}"),
    }
}
```

Fallible operations — parsing, file I/O, network calls — return `Result`. The error is a real value carrying real information, and ignoring it earns a compiler warning, not a silent bug.

## unwrap and expect

`unwrap` takes the value or **panics**; `expect` panics with your message:

```rust
let n: i32 = "42".parse().unwrap();
let config = std::fs::read_to_string("config.txt")
    .expect("config.txt should exist next to the binary");
```

Fine in examples, quick scripts, and cases you've *proven* can't fail — but every `unwrap` in real code is a place your program can die. Prefer `match`, a combinator like `unwrap_or`, or `?`.

## panic!: the emergency exit

```rust
panic!("this should never happen");
```

Panics are for bugs and broken invariants — not for expected failures like bad user input. Those deserve a `Result`.

Handling every `Result` with a full `match` gets verbose fast. Rust's fix is a single character — the `?` operator, next page.
