---
id: 06-test-doubles-and-mocking
title: "Test Doubles and Mocking"
language: csharp
runner: local
estMinutes: 20
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a FakeClock and a SpyNotifier that implement the service's interfaces, then test BillingReminder at three frozen moments in time — asserting on what the spy recorded."
docs: [csharp/interfaces, csharp/classes-and-objects]
checks:
  - id: doubles-green
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Test run ==\nPASS DueTomorrow_SendsNothing\nPASS DueToday_SendsReminder\nPASS Overdue_SendsOverdueNotice\n3 passed, 0 failed\n"
  - id: real-doubles
    type: ai-judge
    rubric: "FakeClock implements IClock with a settable DateOnly Today property (public setter or constructor parameter — controlled by the test either way), and SpyNotifier implements INotifier by appending every Send message to an exposed List<string> — no Console output from either double. Three static test methods named DueTomorrow_SendsNothing, DueToday_SendsReminder, and Overdue_SendsOverdueNotice each construct FRESH doubles, inject them into BillingReminder via its constructor, call CheckInvoice once, and assert through the spy: count 0 for tomorrow; count 1 and the exact string \"Reminder: Acme is due today\" for today; count 1 and \"OVERDUE: Acme was due 2026-03-15\" for overdue — expected strings as literals. All three are registered in the tests array. DateTime.Now, DateTime.Today, and DateOnly.FromDateTime(DateTime.Now) appear nowhere; BillingReminder itself is unmodified."
hints:
  - "The doubles are tiny: class FakeClock : IClock { public DateOnly Today { get; set; } } and class SpyNotifier : INotifier { public List<string> Sent { get; } = new(); public void Send(string message) => Sent.Add(message); }"
  - "Each test freezes its own moment: FakeClock clock = new() { Today = new DateOnly(2026, 3, 14) }; SpyNotifier spy = new(); BillingReminder reminder = new(clock, spy); then reminder.CheckInvoice(\"Acme\", new DateOnly(2026, 3, 15));"
  - "Assert on the recording: AssertEqual(0, spy.Sent.Count) for tomorrow; for the others AssertEqual(1, spy.Sent.Count) plus AssertEqual(\"...\", spy.Sent[0]) with the exact message as a literal."
---
## Standing in for the world

`BillingReminder` decides whether to nag a customer — but it needs
today's date and a way to send messages. Test it against `DateTime.Now`
and a real mail server and you've built the worst kind of test: one that
passes today, fails on the 16th, and emails Acme every time CI runs. The
service already did the one thing that makes it testable — it depends on
**interfaces**, `IClock` and `INotifier`, injected through its
constructor. In production those are the system clock and an SMTP
client. In tests, you hand it **test doubles** — small classes you
control completely.

Two species today. A **fake** has a working implementation you can rig:

```csharp
class FakeClock : IClock
{
    public DateOnly Today { get; set; }   // time travel via a setter
}
```

A **spy** records what happened to it, so the test can look afterward:

```csharp
class SpyNotifier : INotifier
{
    public List<string> Sent { get; } = new();
    public void Send(string message) => Sent.Add(message);
}
```

Now every test is a frozen moment: set the fake to March 14th, run the
check on an invoice due the 15th, and assert the spy heard *nothing*.
Set it to the 20th and assert the spy holds exactly the overdue notice.
Deterministic, instant, no network — and each test builds **fresh
doubles**, because a spy carrying another test's messages produces
lies.

In real projects a library usually writes these classes for you —
[Moq](https://github.com/devlooped/moq) via
`new Mock<IClock>()`, `.Setup(...)`, `.Verify(...)` — and "mock" has
become shorthand for all doubles. The mechanics are exactly what you're
building by hand; hand-rolled fakes remain common and often clearer.

### Your goal

Produce exactly:

```
== Test run ==
PASS DueTomorrow_SendsNothing
PASS DueToday_SendsReminder
PASS Overdue_SendsOverdueNotice
3 passed, 0 failed
```

1. Write `FakeClock` and `SpyNotifier` implementing the starter's
   interfaces.
2. Write the three tests — clock at 2026-03-14 / 03-15 / 03-20, invoice
   always due 2026-03-15, fresh doubles each time.
3. Assert through the spy: nothing sent, then
   `Reminder: Acme is due today`, then
   `OVERDUE: Acme was due 2026-03-15` — expected strings as literals.
4. Register all three and go green.
