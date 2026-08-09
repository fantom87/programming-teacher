Song original = new Song("Clair de Lune", "Debussy", 300);
Song cover = new Song("Clair de Lune", "Debussy", 300);

Console.WriteLine(original == cover);
Console.WriteLine(original);

Song remaster = original with { Seconds = 312 };
Console.WriteLine(remaster);
Console.WriteLine(original.Seconds);

record Song(string Title, string Artist, int Seconds);
