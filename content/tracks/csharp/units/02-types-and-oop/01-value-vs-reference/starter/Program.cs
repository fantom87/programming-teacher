// Part 1 — value types copy the VALUE:
//   int a = 5; copy it into b, add 1 to b, then print:
//   a = 5, b = 6

// Part 2 — reference types copy the REFERENCE:
//   Player p1 = new Player("Ada"); assign p1 to p2 (no new!),
//   set p2.score = 100, then print:
//   p1 score: 100, p2 score: 100

// Part 3 — only new makes an independent object:
//   Player solo = new Player("Grace"); solo.score = 7; then print:
//   Ada: 100, Grace: 7   (using p1 and solo, not literals)

// The Player class is ready for you:
class Player
{
    public string name;
    public int score;

    public Player(string name)
    {
        this.name = name;
    }
}
