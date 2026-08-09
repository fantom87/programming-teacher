List<Game> shelf = new List<Game>
{
    new Game("Hollow Knight", "platformer", 52, 9.6),
    new Game("Celeste", "platformer", 9, 9.2),
    new Game("Hades", "roguelike", 41, 9.4),
    new Game("Dead Cells", "roguelike", 6, 8.7),
    new Game("Skyrim", "rpg", 120, 9.1),
    new Game("Undertale", "rpg", 7, 9.0),
};

HashSet<string> genres = new HashSet<string>(shelf.Select(g => g.Genre));

Console.WriteLine("== Game Shelf Report ==");
Console.WriteLine($"{shelf.Count} games across {genres.Count} genres");
Console.WriteLine($"Total hours: {shelf.Sum(g => g.Hours)}");
Console.WriteLine($"Average rating: {shelf.Average(g => g.Rating):F1}");

Game top = shelf.OrderByDescending(g => g.Rating).First();
Console.WriteLine($"Top rated: {top.Title} ({top.Rating:F1})");

Console.WriteLine();
Console.WriteLine("-- By genre --");
foreach (var group in shelf.GroupBy(g => g.Genre))
{
    Console.WriteLine($"{group.Key}: {group.Count()} games, {group.Sum(g => g.Hours)} hours");
}

Console.WriteLine();
Console.WriteLine("-- Barely started (under 10 hours) --");
var backlog = shelf
    .Where(g => g.Hours < 10)
    .OrderBy(g => g.Hours);
foreach (Game game in backlog)
{
    Console.WriteLine($"{game.Title} ({game.Hours} hours)");
}

class Game
{
    public string Title { get; }
    public string Genre { get; }
    public int Hours { get; }
    public double Rating { get; }

    public Game(string title, string genre, int hours, double rating)
    {
        Title = title;
        Genre = genre;
        Hours = hours;
        Rating = rating;
    }
}
