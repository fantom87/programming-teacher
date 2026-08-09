List<Transaction> ledger = new List<Transaction>
{
    new Transaction(1,  "Paycheck",        "income",    2600.00m),
    new Transaction(3,  "Rent",            "housing",   -900.00m),
    new Transaction(5,  "Groceries",       "food",      -240.50m),
    new Transaction(9,  "Bus pass",        "transport",  -60.00m),
    new Transaction(12, "Concert tickets", "fun",       -180.00m),
    new Transaction(18, "Groceries",       "food",      -195.75m),
    new Transaction(24, "Coffee",          "food",       -80.00m),  // typo! really -8.00
    new Transaction(28, "Late fee",        "fees",       -35.00m),
};

ledger[6] = ledger[6] with { Amount = -8.00m };

decimal income = ledger.Where(t => t.Amount > 0).Sum(t => t.Amount);
decimal spent = ledger.Where(t => t.Amount < 0).Sum(t => t.Amount);
decimal net = income + spent;

Console.WriteLine("== Budget Report ==");
Console.WriteLine($"Income: {income.Signed()}");
Console.WriteLine($"Spent: {spent.Signed()}");
Console.WriteLine($"Net: {net.Signed()}");

Console.WriteLine();
Console.WriteLine("-- By category --");
foreach (var group in ledger.Where(t => t.Amount < 0).GroupBy(t => t.Category))
{
    Console.WriteLine($"{group.Key}: {Math.Abs(group.Sum(t => t.Amount)):F2}");
}

Console.WriteLine();
Console.WriteLine("-- Ledger --");
foreach (Transaction t in ledger)
{
    Console.WriteLine($"Day {t.Day} {t.Description}: {t.Amount.Signed()} [{Label(t)}]");
}

string Label(Transaction t) => t switch
{
    { Amount: > 0m } => "income",
    { Category: "fees" } => "avoidable",
    { Amount: < -150m } => "big ticket",
    _ => "everyday",
};

static class MoneyExtensions
{
    public static string Signed(this decimal amount)
        => amount >= 0 ? $"+{amount:F2}" : $"{amount:F2}";
}

record Transaction(int Day, string Description, string Category, decimal Amount);
