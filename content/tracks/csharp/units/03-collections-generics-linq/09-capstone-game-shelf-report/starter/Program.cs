// Capstone: turn this shelf of games into a computed report.
// Every number in the output must come from the data below — no hardcoding.
List<Game> shelf = new List<Game>
{
    new Game("Hollow Knight", "platformer", 52, 9.6),
    new Game("Celeste", "platformer", 9, 9.2),
    new Game("Hades", "roguelike", 41, 9.4),
    new Game("Dead Cells", "roguelike", 6, 8.7),
    new Game("Skyrim", "rpg", 120, 9.1),
    new Game("Undertale", "rpg", 7, 9.0),
};

// Part 1 — headline stats:
//   == Game Shelf Report ==
//   <count> games across <distinct genre count> genres   (HashSet or Distinct)
//   Total hours: <Sum>
//   Average rating: <Average, :F1>
//   Top rated: <title> (<rating :F1>)                    (OrderByDescending + First)

// Part 2 — blank line, then "-- By genre --" and one GroupBy line per genre:
//   <genre>: <count> games, <sum> hours

// Part 3 — blank line, then "-- Barely started (under 10 hours) --" and each
//   game under 10 hours, sorted by hours ascending:  <title> (<hours> hours)

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
