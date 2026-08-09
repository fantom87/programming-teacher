List<Player> players = new()
{
    new("Iris", "red", 31, 4),
    new("Bo", "blue", 12, 11),
    new("Ada", "red", 25, 7),
    new("Kim", "blue", 19, 2),
    new("Lee", "red", 8, 9),
    new("Max", "blue", 27, 5),
};

// 1. Filter, rank, project, join — one chain.
Console.WriteLine($"stars: {string.Join(", ", players.Where(p => p.Points >= 20).OrderByDescending(p => p.Points).Select(p => p.Name))}");

// 2-4. Collapse the whole roster into single answers.
Console.WriteLine($"avg points: {players.Average(p => p.Points):F1}");
Console.WriteLine($"any 10+ assists: {players.Any(p => p.Assists >= 10)}");
Console.WriteLine($"all above 10: {players.All(p => p.Points > 10)}");

// 5. Bucket by team, order the buckets by their own aggregate.
foreach (var team in players.GroupBy(p => p.Team).OrderByDescending(g => g.Sum(p => p.Points)))
{
    Console.WriteLine($"{team.Key}: {team.Sum(p => p.Points)} pts, {team.Count()} players");
}

// 6. Rank and slice.
foreach (Player p in players.OrderByDescending(p => p.Assists).Take(2))
{
    Console.WriteLine($"{p.Name} {p.Assists}");
}

// 7. One match, straight out.
Console.WriteLine($"first: {players.First(p => p.Team == "blue" && p.Assists < 5).Name}");

record Player(string Name, string Team, int Points, int Assists);
