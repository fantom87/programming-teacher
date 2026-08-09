# Interfaces

An **interface** lists methods a type must have. The twist: Go types satisfy interfaces *implicitly* — no `implements` keyword, no declaration. If it has the methods, it fits.

## Defining and satisfying

```go
package main

import "fmt"

type Notifier interface {
	Send(message string)
}

type Email struct{ To string }

func (e Email) Send(message string) {
	fmt.Println("emailing", e.To, "-", message)
}

type SMS struct{ Number string }

func (s SMS) Send(message string) {
	fmt.Println("texting", s.Number, "-", message)
}

func alert(n Notifier, message string) {
	n.Send("ALERT: " + message)
}

func main() {
	alert(Email{To: "ops@example.com"}, "server down")
	alert(SMS{Number: "555-0100"}, "server down")
}
```

Neither `Email` nor `SMS` mentions `Notifier` anywhere. They satisfy it simply by having a `Send(string)` method. You can even define an interface for types in packages you don't control.

## Small interfaces are the style

Go's most-used interfaces have one or two methods:

- `io.Reader` — anything you can read bytes from (files, network, strings)
- `io.Writer` — anything you can write bytes to
- `fmt.Stringer` — one method, `String() string`; `fmt.Println` calls it automatically
- `error` — yes, errors are just an interface with `Error() string`

Accepting `io.Reader` instead of a concrete file type makes a function instantly work with files, network connections, and test data alike.

## any: the empty interface

`any` (an alias for `interface{}`) has no methods, so *every* type satisfies it:

```go
var x any = 42
x = "now a string"    // fine
```

## Getting the concrete type back

A **type assertion** or **type switch** recovers what's inside:

```go
s, ok := x.(string)    // ok is false if x isn't a string

switch v := x.(type) {
case string:
	fmt.Println("string:", v)
case int:
	fmt.Println("int:", v)
default:
	fmt.Println("something else")
}
```

Reach for `any` sparingly — the joy of Go interfaces is small, precise contracts.
