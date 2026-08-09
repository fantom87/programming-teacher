List<int> numbers = new List<int> { 3, 9, 27, 81, 243 };
List<string> words = new List<string> { "alpha", "beta", "gamma" };

Console.WriteLine(First(numbers));
Console.WriteLine(First(words));
Console.WriteLine(Last(numbers));
Console.WriteLine(Last(words));

T First<T>(List<T> items)
{
    return items[0];
}

T Last<T>(List<T> items)
{
    return items[items.Count - 1];
}
