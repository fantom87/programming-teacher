# Borrowing and references

Moving ownership everywhere would be exhausting. A **reference** lets you use a value without taking it — Rust calls this **borrowing**: look, maybe touch, always give back.

## Shared references: &

```rust
fn length(s: &String) -> usize {
    s.len()                       // read through the reference
}

fn main() {
    let name = String::from("ada");
    let n = length(&name);        // lend it — ownership stays here
    println!("{name}: {n}");      // ada: 3 — still usable!
}
```

In pictures:

```text
name [ptr, len: 3, cap: 3] ──►  "ada"
                ▲
s: &String  ────┘   a borrowed view — owns nothing, drops nothing
```

`&name` creates the reference; `s: &String` receives it. When the borrow ends, `name` is untouched and still the owner.

## Mutable references: &mut

A shared reference can't modify anything. For that, borrow mutably:

```rust
fn add_exclaim(s: &mut String) {
    s.push_str("!");
}

fn main() {
    let mut msg = String::from("hi");
    add_exclaim(&mut msg);
    println!("{msg}");    // hi!
}
```

Every step is explicit: the variable must be `mut`, the caller writes `&mut msg`, the function asks for `&mut String`. You can always see mutation coming.

## The rule: many readers XOR one writer

At any moment a value may have **either** any number of shared references **or** exactly one mutable reference — never both:

```rust
fn main() {
    let mut s = String::from("hi");

    let r1 = &s;
    let r2 = &s;
    println!("{r1} {r2}");    // fine — readers can share

    let w = &mut s;           // ok here: r1 and r2 are finished by now
    w.push_str("!");
    println!("{w}");
}
```

Reorder those lines — using `r1` *after* creating `w` — and the compiler objects: `cannot borrow s as mutable because it is also borrowed as immutable`. This one rule eliminates whole bug families: no iterator invalidation, no data races, no reading data mid-rewrite. Note the flexibility, too: a borrow lasts until its *last use*, not to the end of the block.

## No dangling references

```rust
fn broken() -> &String {
    let s = String::from("oops");
    &s    // error: s dies at the end of this function — the reference would dangle
}
```

Rust refuses to compile a reference to freed memory, period.

Read borrow-checker errors slowly — they name the borrow, the conflict, and usually the fix. They're documentation about your own code.
