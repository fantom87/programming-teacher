---
id: 04-access-modifiers
title: Access Modifiers
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a BankAccount that keeps its balance private and only changes it through Deposit and Withdraw methods that reject bad amounts, exposing the balance read-only."
docs: [csharp/classes-and-objects]
checks:
  - id: guarded-account
    type: stdout
    entry: Program.cs
    match: exact
    value: "Deposited 50. Balance: 50\nRejected deposit of -10.\nWithdrew 20. Balance: 30\nRejected withdrawal of 100.\nFinal balance: 30\n"
  - id: really-encapsulated
    type: ai-judge
    rubric: "The balance lives in a private field (or a property whose setter is private) — never a public field or public settable property. It is exposed read-only via a get-only property or method, and the only mutation paths are Deposit and Withdraw, each of which validates first (Deposit rejects amounts <= 0; Withdraw rejects amounts exceeding the balance) and prints its own result line. The five output lines are produced by these members and the final read-only property — not hard-coded at the top level."
hints:
  - "private double balance; — outside code now can't touch it; only the class's own methods can."
  - "Expose it read-only with a computed property: public double Balance => balance;"
  - "Each method guards first: if (amount <= 0) { print the rejection; return; } — only then change balance and print the success line."
---
## Drawing the curtains

Every member you've written so far wore `public`. Time to meet the other half
of the vocabulary — and the reason it exists.

An **access modifier** says who may touch a member. `public` means anyone.
`private` means *only code inside this class*. (A third one, `protected`,
waits for you in the inheritance lesson.) And here's a C# default worth
memorizing: members with no modifier are `private` — the language assumes
things are secrets until you say otherwise.

Why hide anything? Consider a bank account with a public balance field. Any
line, anywhere, can write `account.balance = -5000;` and no rule you care
about — balances change only by deposit or withdrawal, never below zero —
can be enforced. The class *has* rules but no power to defend them.

Make the field private and the compiler becomes your bouncer:

```csharp
class BankAccount
{
    private double balance;                  // the secret

    public double Balance => balance;        // read-only window

    public void Deposit(double amount)
    {
        if (amount <= 0) { /* reject */ return; }
        balance += amount;                   // the ONLY door in
    }
}
```

Now `account.balance = -5000;` is a *compile error*. Every change must walk
through `Deposit` or `Withdraw`, and those methods check IDs at the door.
This is **encapsulation** — the object guards its own consistency, and
callers literally cannot create an invalid one. Notice the pattern pieces
you already own: a computed property (`Balance`) for reading, guard clauses
for validating.

### Your goal

Build `BankAccount` and run the starter's transaction script to produce:

```
Deposited 50. Balance: 50
Rejected deposit of -10.
Withdrew 20. Balance: 30
Rejected withdrawal of 100.
Final balance: 30
```

1. `private double balance;` exposed read-only as `Balance`.
2. `Deposit(double amount)` — rejects `amount <= 0` with
   `Rejected deposit of {amount}.`, otherwise adds and prints
   `Deposited {amount}. Balance: {balance}`.
3. `Withdraw(double amount)` — rejects amounts over the balance with
   `Rejected withdrawal of {amount}.`, otherwise subtracts and prints
   `Withdrew {amount}. Balance: {balance}`.
