// Create three tickets and call Describe() on each:
//   1. new Ticket()                      -> General entry: $25
//   2. new Ticket("VIP", 75)             -> VIP: $75
//   3. object initializer, Kids at $10   -> Kids: $10

// Finish the Ticket class:
class Ticket
{
    public string Name { get; set; }
    public double Price { get; set; }

    // Constructor 1: public Ticket(string name, double price) — sets both properties.

    // Constructor 2: public Ticket() — chains the defaults: : this("General entry", 25)

    public void Describe()
    {
        Console.WriteLine($"{Name}: ${Price}");
    }
}
