---
id: 08-layered-architecture
title: "Layered Architecture"
language: csharp
runner: local
estMinutes: 22
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a library checkout system in three clean layers — a Loan domain record, a repository interface with an in-memory implementation, and a LoanService holding every business rule — under a presentation layer that only talks to the service."
docs: [csharp/interfaces, csharp/linq-basics, csharp/classes-and-objects]
checks:
  - id: library-run
    type: stdout
    entry: Program.cs
    match: exact
    value: "== City Library ==\nalice checks out Dune: ok\nalice checks out Neuromancer: ok\nalice checks out Foundation: ok\nalice checks out Hyperion: DENIED (loan limit reached)\n-- overdue on 2026-04-01 --\nDune (due 2026-03-25)\n"
  - id: clean-layers
    type: ai-judge
    rubric: "Three layers with dependencies pointing inward. Domain: Loan is a positional record (Member, Title, DateOnly Due) with no I/O and no Console. Data: ILoanRepository declares Add, CountFor(member), and All (or equivalent trio); InMemoryLoanRepository implements it over a private List<Loan> — no business rules in the repository beyond storage/counting. Service: LoanService receives the repository TYPED AS THE INTERFACE via constructor (plus the loan limit as data), TryCheckout enforces the limit by asking the repository before adding, and OverdueOn filters repo.All() by due date — the service never calls Console. Presentation: the top-level statements are the ONLY place Console.WriteLine appears; they construct InMemoryLoanRepository exactly once, hand it to LoanService, loop the requests through TryCheckout, and print ok/DENIED from the returned bool — never reaching into the repository or its List directly. The uncommented starter presentation code is used essentially as given."
hints:
  - "Domain is one line: record Loan(string Member, string Title, DateOnly Due); — data and meaning, no behavior that touches the outside world."
  - "Data layer: interface ILoanRepository { void Add(Loan loan); int CountFor(string member); IEnumerable<Loan> All(); } — the in-memory version wraps a private List<Loan> and answers CountFor with loans.Count(l => l.Member == member)."
  - "Service owns the rules: public bool TryCheckout(string member, string title, DateOnly due) { if (repo.CountFor(member) >= loanLimit) return false; repo.Add(new Loan(member, title, due)); return true; } and OverdueOn(today) => repo.All().Where(l => l.Due < today);"
---
## Where does this code go?

Every feature you add asks the same question, and **layers** are the
standing answer. A layered app is a one-way street:

```
presentation  →  service  →  data access  →  domain
```

Each layer knows only the one beneath it. The **domain** is your
vocabulary — `record Loan(...)`, pure data and meaning, importing
nothing. **Data access** knows how loans are stored; it hides a
`List<Loan>` today, SQL next year, behind `ILoanRepository`. The
**service** layer holds the *business rules* — who may borrow, what
counts as overdue — and talks to storage only through that interface
(injected, of course — lesson 7 wasn't decoration). **Presentation**
formats and prints; it asks the service and displays whatever comes
back.

The discipline is in the *nots*. The repository doesn't know the loan
limit — storing three loans or three hundred is none of its business.
The service never calls `Console.WriteLine` — the same `LoanService`
must serve a web API or a test without a terminal attached. And
presentation never reaches around the service into the repository —
`repo.All()` in the print loop and the rules become optional. When each
layer keeps its lane, you can test the service with a fake repository
(lesson 6!), swap the console for a website, or move to Postgres — each
without touching the other layers. That's the entire sales pitch, and
it's why nearly every serious codebase you'll open is shaped this way.

Concretely: `TryCheckout` asks the repository how many loans the member
has, refuses past the limit, and stores a new `Loan` otherwise —
returning `bool` so presentation can phrase the verdict. `OverdueOn`
filters `repo.All()` by due date. The starter's presentation block
already speaks this API; you're building everything under it.

### Your goal

Produce exactly:

```
== City Library ==
alice checks out Dune: ok
alice checks out Neuromancer: ok
alice checks out Foundation: ok
alice checks out Hyperion: DENIED (loan limit reached)
-- overdue on 2026-04-01 --
Dune (due 2026-03-25)
```

1. Domain: the `Loan` record.
2. Data: `ILoanRepository` (`Add`, `CountFor`, `All`) and
   `InMemoryLoanRepository` over a private `List<Loan>`.
3. Service: `LoanService(ILoanRepository repo, int loanLimit)` with
   `TryCheckout` and `OverdueOn` — all rules here, no printing.
4. Uncomment the presentation block and run it as given — it's the only
   place that prints.
