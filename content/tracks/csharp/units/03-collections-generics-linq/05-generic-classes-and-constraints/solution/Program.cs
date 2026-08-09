Box<int> age = new Box<int>(38);
Box<string> motto = new Box<string>("keep going");

Console.WriteLine(age.Describe());
Console.WriteLine(motto.Describe());

Console.WriteLine(Max(3, 11));
Console.WriteLine(Max("apple", "pear"));

T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) >= 0 ? a : b;
}

class Box<T>
{
    public T Value { get; }

    public Box(T value)
    {
        Value = value;
    }

    public string Describe()
    {
        return $"Box holding {Value}";
    }
}
