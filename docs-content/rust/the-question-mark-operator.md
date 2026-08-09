# The ? operator

Error handling has a rhythm: try something, and if it failed, pass the error up to the caller. The `?` operator turns that rhythm into one character.

## Before and after

The long way:

```rust
use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
    let text = match fs::read_to_string("username.txt") {
        Ok(t) => t,
        Err(e) => return Err(e),
    };
    Ok(text.trim().to_string())
}
```

With `?`:

```rust
use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
    let text = fs::read_to_string("username.txt")?;
    Ok(text.trim().to_string())
}
```

`?` after a `Result` means: if it's `Ok(v)`, unwrap to `v` and keep going; if it's `Err(e)`, **return it from the current function right now**. Failure handling collapses into a postfix character, and the happy path reads straight down the page.

## It chains

```rust
fn first_line(path: &str) -> Result<String, std::io::Error> {
    let text = std::fs::read_to_string(path)?;
    Ok(text.lines().next().unwrap_or("").to_string())
}
```

Several `?`s per function — even per line — are normal. Each one is an early return waiting to trigger.

## The fine print

`?` only works inside functions that return `Result` (or `Option`, where it early-returns `None`). Use it in a plain `()` function and the compiler stops you — the error would have nowhere to go.

## From: mixing error types

Real functions call things with *different* error types. `?` auto-converts errors through the `From` trait — and `Box<dyn Error>` accepts any error, which is perfect while learning:

```rust
use std::error::Error;
use std::fs;

fn load_port() -> Result<u16, Box<dyn Error>> {
    let text = fs::read_to_string("port.txt")?;    // io::Error → Box<dyn Error>
    let port: u16 = text.trim().parse()?;          // ParseIntError → Box<dyn Error>
    Ok(port)
}
```

## main can return Result

Which means `?` works at the top level too:

```rust
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let config = std::fs::read_to_string("config.txt")?;
    println!("loaded {} bytes", config.len());
    Ok(())
}
```

If an error bubbles all the way up, the program prints it and exits nonzero. `Result` for the types, `?` for the plumbing — that pair is Rust error handling, ninety percent of the time.
