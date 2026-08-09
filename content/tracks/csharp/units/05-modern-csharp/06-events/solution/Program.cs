Counter counter = new Counter();

counter.Changed += total => Console.WriteLine($"log: total is {total}");

Action<int> alarm = total =>
{
    if (total > 10) Console.WriteLine("ALARM! over capacity");
};
counter.Changed += alarm;

counter.Add(4);
counter.Add(5);
counter.Add(3);

counter.Changed -= alarm;
counter.Add(1);

class Counter
{
    public int Total { get; private set; }

    public event Action<int>? Changed;

    public void Add(int amount)
    {
        Total += amount;
        Changed?.Invoke(Total);
    }
}
