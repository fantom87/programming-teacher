Console.WriteLine("== Test run ==");

(string Name, Action Test)[] tests =
{
    ("DueTomorrow_SendsNothing", DueTomorrow_SendsNothing),
    ("DueToday_SendsReminder", DueToday_SendsReminder),
    ("Overdue_SendsOverdueNotice", Overdue_SendsOverdueNotice),
};

int passed = 0, failed = 0;
foreach ((string name, Action test) in tests)
{
    try { test(); Console.WriteLine($"PASS {name}"); passed++; }
    catch (Exception e) { Console.WriteLine($"FAIL {name}: {e.Message}"); failed++; }
}
Console.WriteLine($"{passed} passed, {failed} failed");

static void DueTomorrow_SendsNothing()
{
    FakeClock clock = new() { Today = new DateOnly(2026, 3, 14) };
    SpyNotifier spy = new();
    BillingReminder reminder = new(clock, spy);

    reminder.CheckInvoice("Acme", new DateOnly(2026, 3, 15));

    AssertEqual(0, spy.Sent.Count);
}

static void DueToday_SendsReminder()
{
    FakeClock clock = new() { Today = new DateOnly(2026, 3, 15) };
    SpyNotifier spy = new();
    BillingReminder reminder = new(clock, spy);

    reminder.CheckInvoice("Acme", new DateOnly(2026, 3, 15));

    AssertEqual(1, spy.Sent.Count);
    AssertEqual("Reminder: Acme is due today", spy.Sent[0]);
}

static void Overdue_SendsOverdueNotice()
{
    FakeClock clock = new() { Today = new DateOnly(2026, 3, 20) };
    SpyNotifier spy = new();
    BillingReminder reminder = new(clock, spy);

    reminder.CheckInvoice("Acme", new DateOnly(2026, 3, 15));

    AssertEqual(1, spy.Sent.Count);
    AssertEqual("OVERDUE: Acme was due 2026-03-15", spy.Sent[0]);
}

static void AssertEqual<T>(T expected, T actual)
{
    if (!Equals(expected, actual)) throw new Exception($"expected {expected}, got {actual}");
}

interface IClock
{
    DateOnly Today { get; }
}

interface INotifier
{
    void Send(string message);
}

class BillingReminder
{
    private readonly IClock clock;
    private readonly INotifier notifier;

    public BillingReminder(IClock clock, INotifier notifier)
    {
        this.clock = clock;
        this.notifier = notifier;
    }

    public void CheckInvoice(string customer, DateOnly dueDate)
    {
        if (clock.Today > dueDate)
            notifier.Send($"OVERDUE: {customer} was due {dueDate:yyyy-MM-dd}");
        else if (clock.Today == dueDate)
            notifier.Send($"Reminder: {customer} is due today");
    }
}

class FakeClock : IClock
{
    public DateOnly Today { get; set; }
}

class SpyNotifier : INotifier
{
    public List<string> Sent { get; } = new();
    public void Send(string message) => Sent.Add(message);
}
