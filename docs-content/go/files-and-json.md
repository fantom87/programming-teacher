# Files and JSON

Real programs read files, write files, and speak JSON. Go's standard library covers all three without a single dependency.

## Reading and writing whole files

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	err := os.WriteFile("notes.txt", []byte("line one\nline two\n"), 0o644)
	if err != nil {
		fmt.Println("write failed:", err)
		return
	}

	data, err := os.ReadFile("notes.txt")    // data is a []byte
	if err != nil {
		fmt.Println("read failed:", err)
		return
	}
	fmt.Print(string(data))
}
```

`0o644` is the Unix permission for the new file. Notice the rhythm: every file operation returns an error, and every one gets checked.

## Line by line with bufio.Scanner

For big files — or whenever you want lines — open the file and scan:

```go
file, err := os.Open("notes.txt")
if err != nil {
	return err
}
defer file.Close()

scanner := bufio.NewScanner(file)
for scanner.Scan() {
	fmt.Println("line:", scanner.Text())
}
```

`os.Open` gives an `*os.File`, which satisfies `io.Reader` — so this same scanner code works on network connections and strings too.

## JSON: structs in, structs out

`encoding/json` converts between structs and JSON. **Struct tags** control the JSON field names:

```go
type Movie struct {
	Title string `json:"title"`
	Year  int    `json:"year"`
}

m := Movie{Title: "Arrival", Year: 2016}

data, _ := json.MarshalIndent(m, "", "  ")    // struct → JSON bytes
fmt.Println(string(data))
// {
//   "title": "Arrival",
//   "year": 2016
// }
```

And back:

```go
var decoded Movie
err := json.Unmarshal(data, &decoded)    // JSON bytes → struct
fmt.Println(decoded.Title)               // Arrival
```

`Unmarshal` needs a pointer (`&decoded`) so it can fill your struct in place. And only **exported** (capitalized) fields take part — a classic gotcha when a lowercase field silently vanishes from the output.

Files plus JSON is most of a config loader, a cache, or a data pipeline. Add HTTP — next page — and it's most of an API.
