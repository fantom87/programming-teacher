Console.WriteLine("== City Library ==");

(string Member, string Title, DateOnly Due)[] requests =
{
    ("alice", "Dune", new DateOnly(2026, 3, 25)),
    ("alice", "Neuromancer", new DateOnly(2026, 4, 10)),
    ("alice", "Foundation", new DateOnly(2026, 4, 10)),
    ("alice", "Hyperion", new DateOnly(2026, 4, 10)),
};

// ---------- presentation ----------
ILoanRepository repo = new InMemoryLoanRepository();
LoanService service = new(repo, loanLimit: 3);

foreach ((string member, string title, DateOnly due) in requests)
{
    bool ok = service.TryCheckout(member, title, due);
    Console.WriteLine($"{member} checks out {title}: {(ok ? "ok" : "DENIED (loan limit reached)")}");
}

DateOnly today = new(2026, 4, 1);
Console.WriteLine($"-- overdue on {today:yyyy-MM-dd} --");
foreach (Loan loan in service.OverdueOn(today))
{
    Console.WriteLine($"{loan.Title} (due {loan.Due:yyyy-MM-dd})");
}

// ---------- domain ----------
record Loan(string Member, string Title, DateOnly Due);

// ---------- data access ----------
interface ILoanRepository
{
    void Add(Loan loan);
    int CountFor(string member);
    IEnumerable<Loan> All();
}

class InMemoryLoanRepository : ILoanRepository
{
    private readonly List<Loan> loans = new();

    public void Add(Loan loan) => loans.Add(loan);
    public int CountFor(string member) => loans.Count(l => l.Member == member);
    public IEnumerable<Loan> All() => loans;
}

// ---------- service ----------
class LoanService
{
    private readonly ILoanRepository repo;
    private readonly int loanLimit;

    public LoanService(ILoanRepository repo, int loanLimit)
    {
        this.repo = repo;
        this.loanLimit = loanLimit;
    }

    public bool TryCheckout(string member, string title, DateOnly due)
    {
        if (repo.CountFor(member) >= loanLimit) return false;
        repo.Add(new Loan(member, title, due));
        return true;
    }

    public IEnumerable<Loan> OverdueOn(DateOnly today)
        => repo.All().Where(l => l.Due < today);
}
