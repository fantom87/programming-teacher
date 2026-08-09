---
id: 07-dependency-injection
title: "Dependency Injection"
language: csharp
runner: local
estMinutes: 20
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a hand-rolled DI container — a Dictionary from Type to factory with generic Register and Resolve — then wire the receipt printer's whole object graph in one composition root."
docs: [csharp/interfaces, csharp/collections, csharp/classes-and-objects]
checks:
  - id: receipt-run
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Receipt ==\nespresso x2: 7.00\nbagel x1: 3.25\nsubtotal: 10.25\ntax: 0.82\ntotal: 11.07\n"
  - id: container-mechanics
    type: ai-judge
    rubric: "ServiceRegistry holds a Dictionary<Type, Func<object>>; Register<T> stores the factory under typeof(T), and Resolve<T> looks up typeof(T), invokes the factory, and casts to T — throwing an informative exception (InvalidOperationException or similar) when nothing is registered, not returning null. The composition root registers IPriceCatalog -> CafeCatalog, ITaxPolicy -> FlatTax, and ReceiptPrinter with a factory whose lambda builds it FROM registry.Resolve<IPriceCatalog>() and registry.Resolve<ITaxPolicy>() — chained resolution, not new CafeCatalog() inline in the printer factory. The printer used for output comes from registry.Resolve<ReceiptPrinter>(), ReceiptPrinter's constructor takes the two interfaces and the class never news up its own dependencies, and every money figure is computed from the catalog and tax policy (7.00, 10.25, 0.82, 11.07 never appear as literals)."
hints:
  - "The whole container: class ServiceRegistry { private readonly Dictionary<Type, Func<object>> factories = new(); public void Register<T>(Func<T> factory) where T : class => factories[typeof(T)] = factory; public T Resolve<T>() where T : class => factories.TryGetValue(typeof(T), out Func<object>? f) ? (T)f() : throw new InvalidOperationException($\"nothing registered for {typeof(T).Name}\"); }"
  - "Registration order in the composition root: registry.Register<IPriceCatalog>(() => new CafeCatalog()); registry.Register<ITaxPolicy>(() => new FlatTax(0.08m)); — interfaces map to concrete classes."
  - "The graph assembles itself: registry.Register<ReceiptPrinter>(() => new ReceiptPrinter(registry.Resolve<IPriceCatalog>(), registry.Resolve<ITaxPolicy>())); then registry.Resolve<ReceiptPrinter>().Print(order);"
---
## New is glue

Yesterday `BillingReminder` never built its own clock — dependencies
arrived through the constructor, and that's what made doubles possible.
The pattern has a name, **dependency injection**, and one iron rule: a
class *declares* what it needs; it never news up its own collaborators.
`new CafeCatalog()` inside `ReceiptPrinter` would weld the two together
— no test double, no swapping the catalog, no mercy.

But if classes don't build their dependencies, *someone* must. That
place is the **composition root** — one spot, at startup, where the
whole object graph is assembled. And the tool that runs it is a
**container**: at heart, nothing but a dictionary from a type to a
recipe for making one.

You'll build that heart today, and it's small enough to fit in your
head:

```csharp
private readonly Dictionary<Type, Func<object>> factories = new();

public void Register<T>(Func<T> factory) where T : class
    => factories[typeof(T)] = factory;
```

`Register<IPriceCatalog>(() => new CafeCatalog())` files a recipe under
the interface's `Type`. `Resolve<T>` looks the recipe up, invokes it,
and casts the `object` back to `T` — and if nothing was registered, it
throws with the type's name, because a null here should fail loudly at
startup, not quietly at checkout. The payoff is **chained resolution**:
the printer's recipe calls `Resolve` for its own ingredients, so
swapping `FlatTax` for a tax-free weekend is a one-line change in the
root — the printer never knows.

This is precisely what ASP.NET Core does behind
`builder.Services.AddSingleton<IPriceCatalog, CafeCatalog>()` — plus
lifetimes (singleton/scoped/transient) and reflection so you skip the
lambdas. Once you've written the dictionary version, that machinery
reads as convenience, not magic.

### Your goal

Produce exactly:

```
== Receipt ==
espresso x2: 7.00
bagel x1: 3.25
subtotal: 10.25
tax: 0.82
total: 11.07
```

1. Write `ServiceRegistry` — the `Dictionary<Type, Func<object>>`,
   generic `Register<T>`, and `Resolve<T>` that throws when a type is
   missing.
2. In the composition root, register `IPriceCatalog` → `CafeCatalog`,
   `ITaxPolicy` → `FlatTax(0.08m)`, and `ReceiptPrinter` built from two
   `Resolve` calls.
3. `Resolve<ReceiptPrinter>()` and print the starter's order — every
   number computed by the graph.
