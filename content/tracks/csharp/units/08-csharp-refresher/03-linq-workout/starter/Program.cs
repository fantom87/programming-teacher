// The LINQ workout: seven answers, each ONE chained expression off players.
// No accumulator loops — foreach is allowed only to PRINT computed results.

List<Player> players = new()
{
    new("Iris", "red", 31, 4),
    new("Bo", "blue", 12, 11),
    new("Ada", "red", 25, 7),
    new("Kim", "blue", 19, 2),
    new("Lee", "red", 8, 9),
    new("Max", "blue", 27, 5),
};

// 1. stars: names with Points >= 20, highest first, joined with ", ":
//      stars: Iris, Max, Ada
// 2. avg points: Average of Points, formatted :F1  ->  avg points: 20.3
// 3. any 10+ assists: Any(...)                     ->  any 10+ assists: True
// 4. all above 10: All(...) on Points              ->  all above 10: False
// 5. GroupBy Team, groups ordered by summed Points descending, one line each:
//      red: 64 pts, 3 players
//      blue: 58 pts, 3 players
// 6. Top two by Assists, one "<name> <assists>" line each:  Bo 11 / Lee 9
// 7. First blue player with fewer than 5 assists:  first: Kim

record Player(string Name, string Team, int Points, int Assists);
