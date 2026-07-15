int[] scores = { 90, 75, 88, 62 };
Console.WriteLine(scores.Length);

List<string> shelf = new List<string>();
shelf.Add("Dune");
shelf.Add("Foundation");
shelf.Add("Hyperion");

Console.WriteLine(shelf.Count);
foreach (string book in shelf)
{
    Console.WriteLine(book);
}
