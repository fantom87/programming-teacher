# Testing basics

Testing ships with the language: a package in the standard library, a command in the toolchain, and conventions everyone shares. No frameworks to choose.

## The shape of a test

Tests live next to the code, in files ending `_test.go`:

```go
// mathx/mathx.go
package mathx

func Double(n int) int {
	return n * 2
}
```

```go
// mathx/mathx_test.go
package mathx

import "testing"

func TestDouble(t *testing.T) {
	got := Double(21)
	want := 42

	if got != want {
		t.Errorf("Double(21) = %d, want %d", got, want)
	}
}
```

A test is any function named `TestXxx` taking `*testing.T`. There's no assertion library — you write ordinary `if` statements and report failures with `t.Errorf`. The `got`/`want` naming is a convention you'll see everywhere.

## Running

```bash
go test              # this package
go test ./...        # the whole module
go test -v           # list every test as it runs
go test -run Double  # only tests matching a name
```

## Table-driven tests

The signature Go pattern: a slice of cases, one loop, and `t.Run` for a subtest apiece:

```go
func TestDoubleCases(t *testing.T) {
	tests := []struct {
		name string
		in   int
		want int
	}{
		{"zero", 0, 0},
		{"positive", 21, 42},
		{"negative", -3, -6},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Double(tt.in); got != tt.want {
				t.Errorf("Double(%d) = %d, want %d", tt.in, got, tt.want)
			}
		})
	}
}
```

Adding a case is now one line, and failures name the exact case: `TestDoubleCases/negative`.

`t.Errorf` reports and keeps going; `t.Fatalf` reports and stops the test — use it when continuing makes no sense (setup failed, a nil is about to be dereferenced).

## Beyond the basics

- **Benchmarks** — `func BenchmarkDouble(b *testing.B)` looping `b.N` times; run with `go test -bench .`
- **httptest** — spin up fake servers and response recorders to test HTTP code
- **go vet** — catches suspicious code (`go vet ./...`); run it alongside your tests
- **-race** — `go test -race` finds data races while the tests exercise your code

Tests sitting beside the code they check, run by one fast command — that's why Go projects tend to have lots of them.
