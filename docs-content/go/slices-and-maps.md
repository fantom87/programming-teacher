# Slices and maps

Go's two workhorse collections: **slices** for ordered lists, **maps** for key–value lookups.

## Slices: growable lists

```go
package main

import "fmt"

func main() {
	scores := []int{90, 75, 88}    // no size in the brackets = slice

	scores = append(scores, 100)   // append returns the grown slice
	scores[1] = 80

	fmt.Println(scores)            // [90 80 88 100]
	fmt.Println(len(scores))       // 4
	fmt.Println(scores[0])         // 90
}
```

Note the pattern `scores = append(scores, ...)` — `append` may move the data to a bigger home, so you always keep its return value.

## Slicing makes views, not copies

```go
firstTwo := scores[:2]    // [90 80]
middle := scores[1:3]     // [80 88]

middle[0] = 0             // scores[1] is now 0 too — same backing array
```

A slice is a small window onto an underlying array. Cheap to pass around, but edits show through.

## make, when you know the size

```go
buf := make([]int, 0, 100)    // length 0, room for 100 — no regrowing
```

## Maps: lookups by key

```go
ages := map[string]int{
	"Alice": 30,
	"Bob":   25,
}

ages["Carol"] = 41            // add or update
fmt.Println(ages["Alice"])    // 30

delete(ages, "Bob")
fmt.Println(len(ages))        // 2
```

## The comma-ok idiom

A missing key doesn't crash — it returns the zero value. Use the two-value form to tell "missing" apart from "actually zero":

```go
age, ok := ages["Dave"]
if !ok {
	fmt.Println("no Dave here")
}
fmt.Println(age)    // 0 — the zero value for int
```

## Looping

```go
for name, age := range ages {
	fmt.Println(name, age)    // order is deliberately random!
}
```

Map iteration order is randomized on purpose, so you never accidentally depend on it. Need order? Collect the keys into a slice and sort it.

Slices of structs, maps of slices — these two compose into almost every data shape you'll need.
