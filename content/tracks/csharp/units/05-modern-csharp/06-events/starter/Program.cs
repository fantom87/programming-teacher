// A ticket counter that broadcasts every change to whoever subscribed.
Counter counter = new Counter();

// 2. Subscribe a logger:  counter.Changed += ...lambda printing "log: total is {total}"...
// 3. Store an alarm in a variable (you need it again to unsubscribe):
//      Action<int> alarm = ...prints "ALARM! over capacity" when the value is over 10...
//    and subscribe it too.
// 4. counter.Add(4); counter.Add(5); counter.Add(3);
//    then UNSUBSCRIBE the alarm (-=) and counter.Add(1);
//    -> total hits 13, but the alarm stays silent. It left the guest list.

class Counter
{
    public int Total { get; private set; }

    // 1. Declare the event:  public event Action<int>? Changed;

    public void Add(int amount)
    {
        Total += amount;
        // ...and raise it here:  Changed?.Invoke(Total);
    }
}
