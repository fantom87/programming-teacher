# Ownership

Ownership is Rust's core idea — how it guarantees memory safety with no garbage collector. The rules fit on a sticky note:

1. Every value has exactly **one owner** (a variable).
2. When the owner goes out of scope, the value is **dropped** (freed).
3. Assigning or passing a value **moves** ownership — the old owner is done.

## Why the fuss? Stack vs heap

Simple values like integers have a fixed size and live on the **stack** — trivially cheap to copy. A `String` owns text on the **heap**; the variable itself is just a small handle pointing at it:

```text
stack                          heap
s1 [ptr, len: 5, cap: 5] ──►  "hello"
```

If two variables held that same handle, who frees the heap data — and how do we avoid freeing it twice? Ownership is Rust's answer: only one variable holds it at a time.

## Moves

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;           // ownership MOVES from s1 to s2

    println!("{s1}");      // error: borrow of moved value: `s1`
}
```

After the move:

```text
s1  ✗ (dead — the compiler won't let you touch it)
s2 [ptr, len: 5, cap: 5] ──►  "hello"
```

Nothing was copied on the heap — the handle changed hands, and `s1` retired. One owner at a time means exactly one `drop`, exactly once.

## Clone: an explicit deep copy

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();           // heap data actually copied
    println!("{s1} and {s2}");     // both fine — two owners, two values
}
```

Cloning is honest about its cost — that's why it's spelled out.

## Copy types don't move

Fixed-size stack values — integers, floats, `bool`, `char` — implement **Copy**: assignment duplicates them and the original stays usable:

```rust
fn main() {
    let a = 5;
    let b = a;
    println!("{a} {b}");    // 5 5 — no move; integers are Copy
}
```

## Functions take ownership too

Passing a value moves it, exactly like assignment:

```rust
fn shout(s: String) -> String {
    s.to_uppercase()
}

fn main() {
    let name = String::from("ada");
    let loud = shout(name);    // name moves into shout...
    println!("{loud}");        // ADA
    // println!("{name}");     // error — name was given away
}
```

Returning a value moves ownership back out. But handing ownership around just to *look* at a value gets old fast — that's what **borrowing** is for, next page.
