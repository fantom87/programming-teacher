// BillingReminder (bottom of file) depends on IClock + INotifier. Real
// implementations would make its tests flaky and noisy — so you'll build
// doubles: a FakeClock you can set, and a SpyNotifier that records sends.
Console.WriteLine("== Test run ==");

(string Name, Action Test)[] tests =
{
    // 3. Register your tests here, in this order:
    //      ("DueTomorrow_SendsNothing", DueTomorrow_SendsNothing),
    //      ("DueToday_SendsReminder", DueToday_SendsReminder),
    //      ("Overdue_SendsOverdueNotice", Overdue_SendsOverdueNotice),
};

int passed = 0, failed = 0;
foreach ((string name, Action test) in tests)
{
    try { test(); Console.WriteLine($"PASS {name}"); passed++; }
    catch (Exception e) { Console.WriteLine($"FAIL {name}: {e.Message}"); failed++; }
}
Console.WriteLine($"{passed} passed, {failed} failed");

// 1. Write the doubles (with the other classes below):
//      class FakeClock : IClock   — DateOnly Today with a public setter
//      class SpyNotifier : INotifier — List<string> Sent; Send adds to it
// 2. Write three test methods. Each one: FRESH doubles, inject into
//    BillingReminder, one CheckInvoice("Acme", due 2026-03-15) call,
//    then assert on spy.Sent:
//      DueTomorrow_SendsNothing    clock 2026-03-14 -> Count == 0
//      DueToday_SendsReminder      clock 2026-03-15 -> Count == 1 and
//                                    "Reminder: Acme is due today"
//      Overdue_SendsOverdueNotice  clock 2026-03-20 -> Count == 1 and
//                                    "OVERDUE: Acme was due 2026-03-15"
//    Expected strings are literals — never DateTime.Now anywhere.
// Output when green:
//   == Test run ==
//   PASS DueTomorrow_SendsNothing
//   PASS DueToday_SendsReminder
//   PASS Overdue_SendsOverdueNotice
//   3 passed, 0 failed

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
