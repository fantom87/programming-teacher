# Methods

A **method** is a function attached to a type. The type it's attached to is called the **receiver**, and it gets its own set of parentheses before the method name.

## Attaching behavior

```go
package main

import "fmt"

type Account struct {
	Owner   string
	Balance float64
}

func (a Account) Describe() string {
	return fmt.Sprintf("%s has $%.2f", a.Owner, a.Balance)
}

func main() {
	acct := Account{Owner: "Ada", Balance: 10}
	fmt.Println(acct.Describe())    // Ada has $10.00
}
```

`func (a Account)` reads as "a method on Account, which calls itself `a` inside." There's no `this` keyword — you name the receiver yourself, usually one or two letters.

## Value vs pointer receivers

A **value receiver** gets a *copy* — good for reading. A **pointer receiver** gets the real thing — required for modifying:

```go
func (a Account) DepositBroken(amount float64) {
	a.Balance += amount    // modifies a copy that's about to vanish
}

func (a *Account) Deposit(amount float64) {
	a.Balance += amount    // modifies the actual account
}
```

```go
acct := Account{Owner: "Ada", Balance: 10}

acct.DepositBroken(5)
fmt.Println(acct.Balance)    // 10 — nothing happened

acct.Deposit(5)              // Go takes &acct for you
fmt.Println(acct.Balance)    // 15
```

Rule of thumb: if *any* method needs a pointer receiver, give them all pointer receivers. Also prefer pointers for large structs, to skip the copy.

## Constructors are just functions

Go has no constructor keyword — the convention is a function named `New` or `NewType`:

```go
func NewAccount(owner string) *Account {
	return &Account{Owner: owner, Balance: 0}
}
```

## Methods on any named type

Not just structs:

```go
type Celsius float64

func (c Celsius) Freezing() bool {
	return c <= 0
}

fmt.Println(Celsius(-5).Freezing())    // true
```

Methods are how a type satisfies an interface — which is where Go's design gets really interesting.
