# Control flow

Go keeps control flow small: `if`, `switch`, and exactly one loop keyword — `for`.

## if and else

No parentheses around the condition, and braces are always required:

```go
package main

import "fmt"

func main() {
	score := 87

	if score >= 90 {
		fmt.Println("A")
	} else if score >= 80 {
		fmt.Println("B")    // prints
	} else {
		fmt.Println("keep practicing")
	}
}
```

An `if` can run a short statement first — handy for values you only need inside:

```go
if length := len("gopher"); length > 5 {
	fmt.Println("long word:", length)
}
```

## switch

No `break` needed — Go stops after the first matching case:

```go
switch day {
case "Sat", "Sun":
	fmt.Println("weekend")
default:
	fmt.Println("weekday")
}
```

A `switch` with no condition is a cleaner if/else chain:

```go
switch {
case score >= 90:
	fmt.Println("A")
case score >= 80:
	fmt.Println("B")
default:
	fmt.Println("keep practicing")
}
```

## for — the only loop

Go has no `while` or `do-while`. `for` covers every shape:

```go
for i := 0; i < 3; i++ {    // classic counter
	fmt.Println(i)          // 0 1 2
}

n := 1
for n < 100 {               // condition only — a "while" loop
	n *= 2
}

for i := range 3 {          // 0 1 2 — counting, Go 1.22 style
	fmt.Println(i)
}

for {                       // forever — until break
	break
}
```

## range over collections

```go
scores := []int{90, 75, 88}

for i, score := range scores {
	fmt.Println(i, score)      // index and value
}

for _, score := range scores { // _ discards the index
	fmt.Println(score)
}
```

`break` exits a loop early; `continue` skips to the next iteration. And that's the entire control-flow story — Go doesn't have much more to learn here, on purpose.
