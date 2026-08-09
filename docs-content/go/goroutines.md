# Goroutines

A **goroutine** is a function running concurrently with the rest of your program. They're cheap — a few kilobytes each — so Go programs casually run thousands. Starting one takes one keyword.

## go: fire and continue

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	go fmt.Println("from a goroutine")

	fmt.Println("from main")
	time.Sleep(100 * time.Millisecond)    // crude wait — see below
}
```

`go f()` starts `f` and immediately moves on. The catch: **when main returns, the program exits**, taking every goroutine with it — hence the sleep. Real code never sleeps to wait; it coordinates.

## sync.WaitGroup: wait properly

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	for i := range 3 {
		wg.Add(1)              // one more thing to wait for
		go func() {
			defer wg.Done()    // check it off when finished
			fmt.Println("worker", i)
		}()
	}

	wg.Wait()                  // block until the count hits zero
	fmt.Println("all done")
}
```

The workers print in whatever order the scheduler pleases — that unpredictability is the essence of concurrency. (Since Go 1.22, each loop iteration gets its own `i`, so capturing it in a goroutine is safe.)

## Shared data: the race problem

Two goroutines writing the same variable at once is a **data race** — results silently corrupt:

```go
counter := 0
for range 1000 {
	go func() { counter++ }()    // RACE — ends up less than 1000
}
```

Protect shared state with a mutex:

```go
var mu sync.Mutex

mu.Lock()
counter++
mu.Unlock()
```

## The race detector

```bash
go run -race .
go test -race ./...
```

It watches the running program and reports races with stack traces pointing at the guilty lines. Use it constantly.

Goroutines start the work — **channels**, next page, are how they safely talk to each other.
