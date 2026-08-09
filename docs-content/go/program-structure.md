# Program structure

Go is a compiled language from Google that prizes simplicity: a small set of features, one obvious way to do most things, and a toolchain that handles the busywork.

## The smallest program

```go
// main.go
package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
```

Every Go file has the same shape: a **package** clause, then **imports**, then declarations. A runnable program must be `package main` with a `func main()` — that's where execution starts.

## Creating and running a project

```bash
mkdir hello
cd hello
go mod init hello    # creates go.mod — the project file
go run .             # compile and run in one step
go build             # or produce a standalone binary
```

**go.mod** names your module and records its dependencies — Go's answer to a `.csproj` or `package.json`. `go build` gives you a single executable you can copy anywhere.

## Imports are strict

`import "fmt"` brings in the formatting package; `fmt.Println` prints a line. Importing a package you don't use is a *compile error*, not a warning — most editors add and remove imports for you as you type.

## No semicolons, one brace style

Lines end statements. That's also why the opening brace must sit on the same line as `if` or `func` — the compiler quietly inserts semicolons at line ends, and a stray newline would break the statement:

```go
if 2+2 == 4 {
	fmt.Println("Math still works.")
}
```

## gofmt ends the style debate

`gofmt` rewrites every file into the one official layout (tabs, spacing, alignment):

```bash
go fmt ./...
```

Nobody argues about formatting in Go. It's one of the language's best features.

## Comments

```go
// single line
/* multiple
   lines */
```

That's every Go program: a `go.mod`, `.go` files that each declare their package, and `go run` to bring it to life.
