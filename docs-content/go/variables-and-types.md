# Variables and types

Go is statically typed — every variable has one type, fixed at compile time — but you'll rarely spell types out, because Go infers them.

## Three ways to declare

```go
package main

import "fmt"

func main() {
	var age int = 38     // full form
	var city = "Perth"   // type inferred: string
	count := 3           // short form — the one you'll use most

	fmt.Println(age, city, count)
}
```

`:=` declares and assigns in one step. It only works inside functions; at package level, use `var`.

## The core types

- `int` — whole numbers (plus sized variants like `int64`)
- `float64` — decimals
- `string` — UTF-8 text, immutable
- `bool` — `true` or `false`
- `byte` and `rune` — a single byte, a single Unicode character

## Zero values

Declared but never assigned? Go gives it a sensible default instead of leaving it undefined:

```go
var n int       // 0
var s string    // ""
var ok bool     // false
```

This shows up everywhere — a missing map key, a fresh struct — so memorize it: numbers are `0`, strings are `""`, booleans are `false`.

## Constants

```go
const MaxRetries = 3

MaxRetries = 4    // compile error — constants never change
```

## Conversions are always explicit

Go never converts types silently, even "safe" ones:

```go
votes := 41
total := 50.0

fmt.Println(float64(votes) / total)   // 0.82 — must convert first
fmt.Println(int(3.9))                 // 3 — truncates, doesn't round
```

Strings and numbers convert through the `strconv` package:

```go
import "strconv"

s := strconv.Itoa(42)          // int → "42"
n, err := strconv.Atoi("42")   // "42" → 42; err is nil on success
```

That `(value, error)` pair is your first glimpse of Go's error-handling style — it gets a whole page later.
