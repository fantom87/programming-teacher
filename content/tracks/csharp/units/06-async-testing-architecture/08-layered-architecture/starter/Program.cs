// A library checkout system in three layers. The presentation code below is
// finished — build the layers beneath it, then uncomment and run.
Console.WriteLine("== City Library ==");

(string Member, string Title, DateOnly Due)[] requests =
{
    ("alice", "Dune", new DateOnly(2026, 3, 25)),
    ("alice", "Neuromancer", new DateOnly(2026, 4, 10)),
    ("alice", "Foundation", new DateOnly(2026, 4, 10)),
    ("alice", "Hyperion", new DateOnly(2026, 4, 10)),
};

// ---------- presentation (uncomment once your layers exist) ----------
// ILoanRepository repo = new InMemoryLoanRepository();
// LoanService service = new(repo, loanLimit: 3);
//
// foreach ((string member, string title, DateOnly due) in requests)
// {
//     bool ok = service.TryCheckout(member, title, due);
//     Console.WriteLine($"{member} checks out {title}: {(ok ? "ok" : "DENIED (loan limit reached)")}");
// }
//
// DateOnly today = new(2026, 4, 1);
// Console.WriteLine($"-- overdue on {today:yyyy-MM-dd} --");
// foreach (Loan loan in service.OverdueOn(today))
// {
//     Console.WriteLine($"{loan.Title} (due {loan.Due:yyyy-MM-dd})");
// }

// 1. DOMAIN — record Loan(string Member, string Title, DateOnly Due);
//    Pure data. No I/O, no Console, no storage.
// 2. DATA ACCESS — interface ILoanRepository with Add(Loan),
//    CountFor(string member), and All(); then InMemoryLoanRepository
//    implementing it over a PRIVATE List<Loan>. Storage only — the
//    repository has never heard of loan limits.
// 3. SERVICE — class LoanService taking (ILoanRepository repo, int loanLimit)
//    by constructor. TryCheckout: at the limit -> false; otherwise Add a new
//    Loan and return true. OverdueOn(today): every loan due BEFORE today.
//    All the rules live here — and it never prints.
// Only the presentation block above may call Console.WriteLine.
// Output:
//   == City Library ==
//   alice checks out Dune: ok
//   alice checks out Neuromancer: ok
//   alice checks out Foundation: ok
//   alice checks out Hyperion: DENIED (loan limit reached)
//   -- overdue on 2026-04-01 --
//   Dune (due 2026-03-25)
