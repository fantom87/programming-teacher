List<IPayable> payroll = new()
{
    new Salaried("Ada", 90_000m),
    new Hourly("Grace", 25m, 160),
    new Vendor("CleanCo", 450m),
};

decimal total = 0;
foreach (IPayable p in payroll)
{
    total += p.MonthlyCost;
    Console.WriteLine($"{p.Name}: {p.MonthlyCost:F2} ({p.Kind})");
}
Console.WriteLine($"total: {total:F2}");

interface IPayable
{
    string Name { get; }
    decimal MonthlyCost { get; }
    string Kind { get; }
}

abstract class Employee : IPayable
{
    protected Employee(string name) => Name = name;

    public string Name { get; }
    public abstract decimal MonthlyCost { get; }
    public virtual string Kind => "employee";
}

class Salaried : Employee
{
    private readonly decimal annual;

    public Salaried(string name, decimal annual) : base(name) => this.annual = annual;

    public override decimal MonthlyCost => annual / 12;
}

class Hourly : Employee
{
    private readonly decimal rate;
    private readonly int hoursPerMonth;

    public Hourly(string name, decimal rate, int hoursPerMonth) : base(name)
    {
        this.rate = rate;
        this.hoursPerMonth = hoursPerMonth;
    }

    public override decimal MonthlyCost => rate * hoursPerMonth;
    public override string Kind => "hourly employee";
}

class Vendor : IPayable
{
    public Vendor(string name, decimal monthly)
    {
        Name = name;
        MonthlyCost = monthly;
    }

    public string Name { get; }
    public decimal MonthlyCost { get; }
    public string Kind => "vendor";
}
