# Structs

A **struct** groups related values under one name — Go's building block for modeling data. No classes, no inheritance: just data, plus methods you'll add on the next page.

## Defining and creating

```go
package main

import "fmt"

type Point struct {
	X int
	Y int
}

func main() {
	p := Point{X: 3, Y: 4}

	fmt.Println(p.X)       // 3
	p.Y = 10

	var origin Point       // zero value: every field zeroed
	fmt.Println(origin)    // {0 0}
}
```

Field names follow the usual Go rule: capitalized fields are visible outside the package, lowercase ones aren't.

## Structs are values

Assignment copies the whole struct:

```go
a := Point{X: 1, Y: 2}
b := a              // full copy
b.X = 99
fmt.Println(a.X)    // 1 — untouched
```

To share one struct instead, use a pointer:

```go
ptr := &a
ptr.X = 99          // shorthand for (*ptr).X
fmt.Println(a.X)    // 99
```

Go auto-dereferences struct pointers, so `ptr.X` just works — no `->` operator to learn.

## Nested and embedded structs

Structs nest naturally:

```go
type Address struct {
	City string
}

type Person struct {
	Name    string
	Address Address
}

p := Person{Name: "Ada", Address: Address{City: "London"}}
fmt.Println(p.Address.City)    // London
```

**Embedding** — a field with no name — promotes the inner type's fields and methods onto the outer struct:

```go
type Logger struct {
	Prefix string
}

type Server struct {
	Logger      // embedded
	Port   int
}

s := Server{Logger: Logger{Prefix: "[web]"}, Port: 8080}
fmt.Println(s.Prefix)    // [web] — promoted from Logger
```

This is Go's composition-over-inheritance story: build bigger types by combining small ones.

Structs really come alive once they have behavior — that's methods, next.
