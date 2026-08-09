# HTTP client and server

`net/http` is famously complete: real production services run on the standard library alone.

## Making requests

```go
package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	resp, err := http.Get("https://api.github.com/zen")
	if err != nil {
		fmt.Println("request failed:", err)
		return
	}
	defer resp.Body.Close()    // always — leaked bodies leak connections

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("read failed:", err)
		return
	}
	fmt.Println(resp.StatusCode)    // 200
	fmt.Println(string(body))
}
```

Three habits to build: check the error, `defer resp.Body.Close()`, and look at `resp.StatusCode` — a 404 page is *not* an error in Go's eyes. For JSON APIs, decode straight into a struct: `json.NewDecoder(resp.Body).Decode(&result)`.

## A server in twenty lines

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /hello/{name}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, %s!\n", r.PathValue("name"))
	})

	fmt.Println("listening on http://localhost:8080")
	http.ListenAndServe(":8080", mux)
}
```

Run it, then visit `http://localhost:8080/hello/Ada`. Since Go 1.22, mux patterns can include the HTTP method (`GET `) and path wildcards (`{name}`), read back with `r.PathValue`.

## The handler signature

Every handler gets the same two arguments:

- `w http.ResponseWriter` — write your response here (it's an `io.Writer`)
- `r *http.Request` — everything about the request: URL, headers, body

```go
w.Header().Set("Content-Type", "application/json")
w.WriteHeader(http.StatusCreated)    // 201 — set before writing the body
json.NewEncoder(w).Encode(map[string]string{"status": "created"})
```

## Middleware is just wrapping

A middleware is a function that takes a handler and returns a handler:

```go
func logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

http.ListenAndServe(":8080", logging(mux))
```

No framework required — this composable wrapping pattern *is* how Go web services are built.
