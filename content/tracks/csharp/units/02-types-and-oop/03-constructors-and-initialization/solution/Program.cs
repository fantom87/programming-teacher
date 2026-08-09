Ticket standard = new Ticket();
Ticket vip = new Ticket("VIP", 75);
Ticket kids = new Ticket { Name = "Kids", Price = 10 };

standard.Describe();
vip.Describe();
kids.Describe();

class Ticket
{
    public string Name { get; set; }
    public double Price { get; set; }

    public Ticket(string name, double price)
    {
        Name = name;
        Price = price;
    }

    public Ticket() : this("General entry", 25)
    {
    }

    public void Describe()
    {
        Console.WriteLine($"{Name}: ${Price}");
    }
}
