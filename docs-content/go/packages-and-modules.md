# Packages and modules

Two layers of organization: a **package** is a directory of Go files that belong together; a **module** is a whole project — a tree of packages with a `go.mod` at the root.

## Packages and exported names

Every file declares its package on line one. Visibility is decided by capitalization alone:

```go
// greet/greet.go
package greet

// Hello starts with a capital letter — exported (public).
func Hello(name string) string {
	return decorate("Hello, " + name)
}

// decorate is lowercase — private to package greet.
func decorate(s string) string {
	return s + "!"
}
```

No `public` or `private` keywords: `Hello` is usable from other packages, `decorate` isn't.

## Importing your own packages

```
myapp/
├── go.mod          module myapp
├── main.go         package main
└── greet/
    └── greet.go    package greet
```

```go
// main.go
package main

import (
	"fmt"

	"myapp/greet"
)

func main() {
	fmt.Println(greet.Hello("Ada"))    // Hello, Ada!
}
```

Import paths are the module name plus the directory. Calls are always qualified: `greet.Hello`, never a bare `Hello`.

## Adding dependencies

```bash
go get github.com/google/uuid
```

```go
import "github.com/google/uuid"

id := uuid.New()
```

`go.mod` records the exact version; `go.sum` records checksums so builds are reproducible. `go mod tidy` cleans up both after you add or remove imports.

## internal packages

Anything under a directory named `internal/` can only be imported by code in the same module — a compiler-enforced "keep out" sign for your implementation details.

## Documentation is built in

Comments directly above exported names *are* the documentation:

```go
// Hello returns a friendly greeting for name.
func Hello(name string) string { ...
```

```bash
go doc fmt.Println    # read docs in the terminal
```

Start each doc comment with the name it describes — "Hello returns..." — and tools like `pkg.go.dev` render them beautifully.

Small packages with clear names, one module per project — that's the whole organizational model.
