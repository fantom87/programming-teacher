# Functions

Functions are declared with `func`, and types come *after* names — `a int`, not `int a`.

## The basics

```go
package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(2, 3))    // 5
}
```

Parameters of the same type can share it: `(a, b int)` means both are `int`. The return type sits at the end.

## Multiple return values

Go functions can return more than one thing — and the language leans on this constantly:

```go
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("cannot divide %g by zero", a)
	}
	return a / b, nil
}

func main() {
	result, err := divide(10, 4)
	if err != nil {
		fmt.Println("uh oh:", err)
		return
	}
	fmt.Println(result)    // 2.5
}
```

The `(value, error)` pair is *the* Go idiom — you'll meet it properly on the error-handling page. Use `_` to discard a return value you don't need.

## Variadic functions

`...` accepts any number of arguments:

```go
func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

sum(1, 2, 3)      // 6 — nums is a slice inside the function
sum(scores...)    // spread an existing slice into the call
```

## Functions are values

Assign them to variables, pass them around, return them:

```go
double := func(n int) int { return n * 2 }
fmt.Println(double(21))    // 42
```

```go
func apply(nums []int, f func(int) int) []int {
	out := make([]int, 0, len(nums))
	for _, n := range nums {
		out = append(out, f(n))
	}
	return out
}

fmt.Println(apply([]int{1, 2, 3}, double))    // [2 4 6]
```

Anonymous functions also **close over** the variables around them — you'll use that constantly with goroutines. Next up: where those slices came from.
