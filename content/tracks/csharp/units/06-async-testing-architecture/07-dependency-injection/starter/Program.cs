// The cafe's classes are ready (bottom of file) — ReceiptPrinter already
// declares its needs via constructor. Your job is the wiring: a hand-rolled
// DI container and one composition root that assembles the object graph.
Console.WriteLine("== Receipt ==");

(string Item, int Qty)[] order = { ("espresso", 2), ("bagel", 1) };

// 1. Write class ServiceRegistry (below, with the other classes):
//      - a Dictionary<Type, Func<object>> of factories
//      - public void Register<T>(Func<T> factory) where T : class
//          stores the factory under typeof(T)
//      - public T Resolve<T>() where T : class
//          looks up typeof(T), invokes, casts to T — and THROWS
//          InvalidOperationException naming the type when unregistered.
// 2. Composition root (here): register
//      IPriceCatalog  -> new CafeCatalog()
//      ITaxPolicy     -> new FlatTax(0.08m)
//      ReceiptPrinter -> new ReceiptPrinter(Resolve<IPriceCatalog>(),
//                                           Resolve<ITaxPolicy>())
// 3. ReceiptPrinter printer = registry.Resolve<ReceiptPrinter>();
//    printer.Print(order);
// Output:
//   == Receipt ==
//   espresso x2: 7.00
//   bagel x1: 3.25
//   subtotal: 10.25
//   tax: 0.82
//   total: 11.07

interface IPriceCatalog
{
    decimal PriceOf(string item);
}

interface ITaxPolicy
{
    decimal TaxOn(decimal subtotal);
}

class CafeCatalog : IPriceCatalog
{
    private readonly Dictionary<string, decimal> prices = new()
    {
        ["espresso"] = 3.50m,
        ["bagel"] = 3.25m,
    };

    public decimal PriceOf(string item) => prices[item];
}

class FlatTax : ITaxPolicy
{
    private readonly decimal rate;
    public FlatTax(decimal rate) => this.rate = rate;
    public decimal TaxOn(decimal subtotal) => Math.Round(subtotal * rate, 2);
}

class ReceiptPrinter
{
    private readonly IPriceCatalog catalog;
    private readonly ITaxPolicy tax;

    public ReceiptPrinter(IPriceCatalog catalog, ITaxPolicy tax)
    {
        this.catalog = catalog;
        this.tax = tax;
    }

    public void Print((string Item, int Qty)[] order)
    {
        decimal subtotal = 0m;
        foreach ((string item, int qty) in order)
        {
            decimal line = catalog.PriceOf(item) * qty;
            subtotal += line;
            Console.WriteLine($"{item} x{qty}: {line:F2}");
        }
        decimal taxDue = tax.TaxOn(subtotal);
        Console.WriteLine($"subtotal: {subtotal:F2}");
        Console.WriteLine($"tax: {taxDue:F2}");
        Console.WriteLine($"total: {subtotal + taxDue:F2}");
    }
}
