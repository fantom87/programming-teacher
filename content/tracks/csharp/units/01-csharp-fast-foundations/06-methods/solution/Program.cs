Console.WriteLine(Square(7));
Console.WriteLine(Greet("Ada"));
Console.WriteLine(Square(12));

int Square(int n)
{
    return n * n;
}

string Greet(string name)
{
    return $"Hello, {name}!";
}
