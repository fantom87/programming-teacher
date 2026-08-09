List<string> words = new List<string> { "orbit", "sun", "planetary", "moon", "asteroid" };

var longWords = from w in words
                where w.Length > 4
                orderby w
                select w.ToUpper();

foreach (string word in longWords)
{
    Console.WriteLine(word);
}

words.Add("comet");
Console.WriteLine("--- after adding comet ---");

foreach (string word in longWords)
{
    Console.WriteLine(word);
}

Console.WriteLine(longWords.Count());
