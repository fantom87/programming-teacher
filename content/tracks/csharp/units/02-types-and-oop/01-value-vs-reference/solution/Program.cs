// Part 1 — value types copy the value.
int a = 5;
int b = a;
b = b + 1;
Console.WriteLine($"a = {a}, b = {b}");

// Part 2 — reference types copy the reference.
Player p1 = new Player("Ada");
Player p2 = p1;
p2.score = 100;
Console.WriteLine($"p1 score: {p1.score}, p2 score: {p2.score}");

// Part 3 — only new creates an independent object.
Player solo = new Player("Grace");
solo.score = 7;
Console.WriteLine($"{p1.name}: {p1.score}, {solo.name}: {solo.score}");

class Player
{
    public string name;
    public int score;

    public Player(string name)
    {
        this.name = name;
    }
}
