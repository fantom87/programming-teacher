# Lifetimes: a first look

Every reference has a **lifetime** — the stretch of code where it's valid. You've been using them all along; the compiler was writing them for you. This page is about the moments it asks for help.

## The problem lifetimes solve

```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;          // error: `x` does not live long enough
    }
    println!("{r}");     // r would point at freed memory
}
```

The borrow checker compares lifetimes: `r` outlives `x`, so a reference to `x` can't be stored in `r`. This is the dangling-pointer bug from C, caught at compile time.

## When the compiler asks: annotations

Usually lifetimes are inferred (the rules are called **elision**). But some signatures are genuinely ambiguous:

```rust
fn longest(a: &str, b: &str) -> &str {    // error: missing lifetime specifier
    if a.len() > b.len() { a } else { b }
}
```

The returned reference is sometimes `a`, sometimes `b` — so how long is it good for? The compiler won't guess. You annotate:

```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
```

Read `'a` (said "tick A") as a placeholder: "the result lives at most as long as the shorter-lived of `a` and `b`." Annotations never *change* how long anything lives — they only describe relationships, so the compiler can check callers:

```rust
fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("short");
        result = longest(&s1, &s2);
        println!("{result}");    // fine — used while s2 is still alive
    }
    // println!("{result}");     // error: s2 (maybe the winner) is gone
}
```

## Structs holding references

A struct that stores a reference needs a lifetime parameter — it must not outlive what it borrows:

```rust
struct Excerpt<'a> {
    text: &'a str,
}

fn main() {
    let novel = String::from("It was a dark and stormy night. Rain fell.");
    let first = novel.split('.').next().unwrap();
    let quote = Excerpt { text: first };
    println!("{}", quote.text);    // It was a dark and stormy night
}
```

## Don't memorize — respond

Most Rust code needs no lifetime annotations at all: elision covers the common shapes, and owned types (`String`, `Vec`) sidestep the question entirely. Treat lifetime errors like the rest of the borrow checker's output: read the message, add the annotation it suggests, and move on. The deeper story — smart pointers, shared ownership — comes later.
