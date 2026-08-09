# Collections

Rust's two everyday collections: `Vec<T>` for ordered lists, `HashMap<K, V>` for key–value lookups. Both own their contents — so the borrow rules you've learned come along for the ride.

## Vec: the growable list

```rust
fn main() {
    let mut scores = vec![90, 75, 88];    // the vec! macro

    scores.push(100);
    println!("{}", scores.len());    // 4
    println!("{}", scores[0]);       // 90
    println!("{scores:?}");          // [90, 75, 88, 100]
}
```

Indexing out of bounds panics. When the index might be wrong, `get` returns an `Option` instead:

```rust
match scores.get(10) {
    Some(s) => println!("{s}"),
    None => println!("no such index"),    // this prints — no crash
}
```

## Three ways to iterate

How you loop decides what happens to ownership:

```rust
fn main() {
    let mut scores = vec![90, 75, 88];

    for s in &scores {          // borrow — read only
        println!("{s}");
    }

    for s in &mut scores {      // mutable borrow — change in place
        *s += 1;                // * reaches through the reference
    }
    println!("{scores:?}");     // [91, 76, 89]

    for s in scores {           // move — consumes the vec
        println!("{s}");
    }
    // scores is gone now — moved into the loop
}
```

The same trio exists as methods: `.iter()`, `.iter_mut()`, `.into_iter()`. And the borrow rule pays off here: pushing to a vec *while* looping over it — a classic crash in other languages — simply doesn't compile.

## HashMap

```rust
use std::collections::HashMap;

fn main() {
    let mut ages = HashMap::new();
    ages.insert(String::from("Alice"), 30);
    ages.insert(String::from("Bob"), 25);

    match ages.get("Alice") {
        Some(age) => println!("{age}"),    // 30
        None => println!("unknown"),
    }

    for (name, age) in &ages {
        println!("{name}: {age}");         // order not guaranteed
    }
}
```

`get` returns `Option<&V>` — the missing-key question, asked by the type system every single time.

## The entry API

Counting things — the classic — in one line per word:

```rust
use std::collections::HashMap;

fn main() {
    let text = "the quick fox jumps over the lazy dog the end";
    let mut counts = HashMap::new();

    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }
    println!("{:?}", counts.get("the"));    // Some(3)
}
```

`entry` finds the slot, `or_insert(0)` fills it if empty, `*... += 1` bumps it. Memorize this idiom — it's everywhere.

Vecs of structs, HashMaps of vecs — compose these two and you can model most data. Strings, though, deserve their own page.
