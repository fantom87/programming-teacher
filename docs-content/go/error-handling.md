# Error handling

Go has no exceptions for everyday failures. Errors are ordinary **values**, returned alongside results — visible in every signature, impossible to forget.

## The (value, error) pattern

```go
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("user not found")

func findUser(id int) (string, error) {
	if id != 1 {
		return "", fmt.Errorf("looking up user %d: %w", id, ErrNotFound)
	}
	return "Ada", nil
}

func main() {
	name, err := findUser(2)
	if err != nil {
		fmt.Println("failed:", err)    // failed: looking up user 2: user not found
		return
	}
	fmt.Println("found", name)
}
```

`if err != nil { return }` is the heartbeat of Go code. Handle the failure, return early, and let the happy path flow down the page unindented.

## Creating and wrapping errors

- `errors.New("message")` — a simple fixed error
- `fmt.Errorf("context: %w", err)` — wrap an error with context; `%w` keeps the original inside

Wrapping builds a chain: each layer adds what *it* was doing, so the final message reads like a story.

## Checking with errors.Is and errors.As

Plain `==` breaks once errors are wrapped. `errors.Is` looks through the whole chain:

```go
if errors.Is(err, ErrNotFound) {
	fmt.Println("no such user — try another id")
}
```

`errors.As` does the same for custom error *types*, extracting one so you can inspect its fields.

## defer: cleanup that can't be forgotten

`defer` schedules a call for when the function returns — every exit path included:

```go
file, err := os.Open("data.txt")
if err != nil {
	return err
}
defer file.Close()    // runs no matter how the function ends
```

## panic and recover

`panic` crashes the program with a stack trace — for genuine bugs (index out of range, impossible states), not expected failures like a missing file. `recover` can catch a panic mid-crash, but idiomatic Go almost never uses it. When in doubt: return an error.

Boring, explicit, everywhere — and after a week of it, you'll miss it in other languages.
