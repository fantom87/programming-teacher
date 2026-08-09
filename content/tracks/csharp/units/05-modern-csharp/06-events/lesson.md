---
id: 06-events
title: Events
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Give the Counter class a real event — declared with the event keyword and raised with ?.Invoke — then subscribe a logger and an alarm, watch both fire, and unsubscribe the alarm mid-run."
docs: [csharp/classes-and-objects, csharp/methods]
checks:
  - id: event-sequence
    type: stdout
    entry: Program.cs
    match: exact
    value: "log: total is 4\nlog: total is 9\nlog: total is 12\nALARM! over capacity\nlog: total is 13\n"
  - id: real-event
    type: ai-judge
    rubric: "Changed is declared inside Counter with the event keyword (public event Action<int>? Changed;), not as a plain public delegate field, and it is raised exactly once inside Add with the null-conditional form Changed?.Invoke(Total). The logger subscribes with += (a lambda printing the log line from the value the event passes). The alarm is stored in an Action<int> variable, subscribed with +=, prints ALARM only when its parameter exceeds 10 via its own condition, and is UNSUBSCRIBED with -= before the final Add(1). None of the five output lines are printed directly from top-level code — they all flow through event subscribers reacting to Add calls."
hints:
  - "Inside Counter: public event Action<int>? Changed; — and at the end of Add: Changed?.Invoke(Total); (the ? guards the no-subscribers case, when the event is null)."
  - "Subscribing is +=: counter.Changed += total => Console.WriteLine($\"log: total is {total}\"); — the event passes Total to every subscriber."
  - "To unsubscribe later you need the SAME delegate, so keep the alarm in a variable: Action<int> alarm = ...; counter.Changed += alarm; ... counter.Changed -= alarm;"
---
## Don't call us — we'll call you

So far your objects only speak when spoken to. Real systems are full of the
opposite arrangement: *tell me when something happens*. A download
finishes, a timer fires, a total crosses a limit. C#'s tool for this is the
**event** — a delegate field with a guest list:

```csharp
class Counter
{
    public event Action<int>? Changed;

    public void Add(int amount)
    {
        Total += amount;
        Changed?.Invoke(Total);   // notify everyone who signed up
    }
}
```

Outsiders subscribe with `+=`, handing over any `Action<int>` — a lambda, a
stored delegate, a method name. Several can join; raising the event runs
every subscriber, in subscription order. The `?.Invoke` matters: with no
subscribers the event is `null`, and the `?.` turns "crash" into "nobody to
tell, move on."

Why the `event` keyword at all, when lesson 5 showed a plain
`Action<int>` field would compile? Because `event` is an access rail. From
outside the class, `+=` and `-=` are the *only* legal operations — no
outsider can assign `= null` (wiping every other subscriber's registration)
and no outsider can invoke it, pretending a change happened. Only the
owning class raises its own events. It's `private set` energy, applied to
notification.

And `-=` is not a footnote. Subscribing wires the publisher to you; while
that wire exists, you're reachable and your handler keeps firing.
Long-lived publishers full of forgotten subscriptions are one of the
classic .NET memory leaks — real code unsubscribes when it stops caring,
which is exactly what you'll do below: the alarm gets removed mid-run, and
the total sails past the threshold in silence.

### Your goal

Produce exactly:

```
log: total is 4
log: total is 9
log: total is 12
ALARM! over capacity
log: total is 13
```

1. In `Counter`: declare `public event Action<int>? Changed;` and raise it
   at the end of `Add` with `?.Invoke`.
2. Subscribe a logger lambda printing `log: total is {total}`.
3. Store an alarm in an `Action<int>` variable — prints
   `ALARM! over capacity` when its value is over 10 — and subscribe it.
4. `Add(4)`, `Add(5)`, `Add(3)` — then unsubscribe the alarm with `-=`
   and `Add(1)`. Total 13, no alarm: it left the guest list.
