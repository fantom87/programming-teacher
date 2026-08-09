// The driver below is FINISHED — do not edit it or IPayable. Write the four
// types described at the bottom so this compiles and every figure is computed.

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

// 1. abstract class Employee : IPayable — the constructor stores the name in
//    a get-only property; MonthlyCost stays ABSTRACT; Kind is VIRTUAL and
//    returns "employee".
// 2. class Salaried : Employee — takes an annual salary; MonthlyCost is the
//    annual figure / 12. Kind is inherited untouched.
// 3. class Hourly : Employee — takes an hourly rate and hours per month;
//    MonthlyCost multiplies them; OVERRIDE Kind to "hourly employee".
// 4. class Vendor : IPayable — no Employee inheritance: a name, a flat
//    monthly amount, Kind "vendor".
