# Strings and slices

Rust has two string types, and the split is pure ownership: `String` **owns** its text; `&str` **borrows** a view of text living elsewhere. Every "why are there two strings?!" moment resolves to that sentence.

## String and &str

```rust
fn main() {
    let literal = "hello";                   // &str — borrowed, fixed
    let mut owned = String::from(literal);   // String — owned, growable

    owned.push_str(", world");
    owned.push('!');
    println!("{owned}");                     // hello, world!

    let view: &str = &owned;                 // borrow a String as &str
    println!("{view}");
}
```

String literals are `&str` — views into text baked into your binary. Build owned strings with `String::from`, `.to_string()`, or `format!`:

```rust
let name = "Ada";
let greeting = format!("Hello, {name}!");    // like println!, but returns a String
```

## Functions should accept &str

A `&String` quietly converts to `&str`, so `&str` parameters accept both:

```rust
fn shout(text: &str) -> String {
    text.to_uppercase()
}

fn main() {
    let owned = String::from("hi");
    println!("{}", shout(&owned));     // works with a String
    println!("{}", shout("hello"));    // and with a literal
}
```

## Why you can't index a string

Rust strings are UTF-8: a character takes one to four bytes, so `s[0]` (which byte? which character?) is a compile error rather than a lie:

```rust
fn main() {
    let word = "héllo";
    // let first = word[0];         // error: cannot be indexed

    for c in word.chars() {         // characters
        print!("{c} ");             // h é l l o
    }
    println!("{}", word.len());     // 6 — bytes, not characters!
}
```

`chars()` walks characters, `bytes()` walks raw bytes.

## Slices: borrowed views in general

`&str` is one instance of a **slice** — a reference to a stretch of data. Arrays and vecs slice the same way:

```rust
fn sum(numbers: &[i32]) -> i32 {      // &[i32]: a slice of ints
    let mut total = 0;
    for n in numbers {
        total += n;
    }
    total
}

fn main() {
    let v = vec![1, 2, 3, 4];
    println!("{}", sum(&v));          // 10 — the whole vec
    println!("{}", sum(&v[1..3]));    // 5 — just a window
}
```

Same convention as `&str`: functions accept the borrowed slice form (`&[T]`), callers lend whatever they have. Owned for building, borrowed for reading — Rust's string story is the ownership story in miniature.
