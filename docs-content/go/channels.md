# Channels

A **channel** is a typed pipe between goroutines: one sends values in, another receives them out. Instead of sharing memory and locking it, goroutines hand data to each other.

## Send and receive

```go
package main

import "fmt"

func main() {
	messages := make(chan string)

	go func() {
		messages <- "ping"    // send (blocks until someone receives)
	}()

	msg := <-messages         // receive (blocks until someone sends)
	fmt.Println(msg)          // ping
}
```

The arrow shows the direction of flow. Both ends **block** until the other side is ready — and that blocking *is* the synchronization. No sleeps, no flags.

## Buffered channels

Give a channel capacity and sends don't block until it's full:

```go
jobs := make(chan int, 2)
jobs <- 1
jobs <- 2     // fine — room in the buffer
// jobs <- 3  // this one would block until someone receives
```

## Closing and ranging

The sender closes a channel to say "no more values." Receivers can `range` until then:

```go
package main

import "fmt"

func main() {
	jobs := make(chan int)

	go func() {
		for j := 1; j <= 3; j++ {
			jobs <- j
		}
		close(jobs)
	}()

	for j := range jobs {    // receives until the channel is closed
		fmt.Println("got", j)
	}
}
```

## select: wait on several channels

`select` is a `switch` for channel operations — whichever is ready first wins:

```go
select {
case msg := <-messages:
	fmt.Println("received", msg)
case <-time.After(time.Second):
	fmt.Println("timed out")
}
```

That timeout pattern — racing a real channel against `time.After` — appears in nearly every networked Go program. (`context.Context` builds on the same idea to cancel whole trees of work.)

## The worker pool shape

Classic Go: one `jobs` channel, one `results` channel, and a handful of goroutines ranging over `jobs`. A few lines of code doing what other languages need thread-pool libraries for.

Go's proverb sums up the philosophy: *don't communicate by sharing memory; share memory by communicating.*
