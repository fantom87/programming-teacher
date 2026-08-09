Console.WriteLine("== Receipt ==");

(string Item, int Qty)[] order = { ("espresso", 2), ("bagel", 1) };

ServiceRegistry registry = new();
registry.Register<IPriceCatalog>(() => new CafeCatalog());
registry.Register<ITaxPolicy>(() => new FlatTax(0.08m));
registry.Register<ReceiptPrinter>(() => new ReceiptPrinter(
    registry.Resolve<IPriceCatalog>(),
    registry.Resolve<ITaxPolicy>()));

ReceiptPrinter printer = registry.Resolve<ReceiptPrinter>();
printer.Print(order);

class ServiceRegistry
{
    private readonly Dictionary<Type, Func<object>> factories = new();

    public void Register<T>(Func<T> factory) where T : class
        => factories[typeof(T)] = factory;

    public T Resolve<T>() where T : class
        => factories.TryGetValue(typeof(T), out Func<object>? factory)
            ? (T)factory()
            : throw new InvalidOperationException($"nothing registered for {typeof(T).Name}");
}

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
