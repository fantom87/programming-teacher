List<Order> orders = new List<Order>
{
    new Order("Espresso", "drink", 3),
    new Order("Latte", "drink", 5),
    new Order("Bagel", "food", 4),
    new Order("Sandwich", "food", 9),
    new Order("Tea", "drink", 3),
};

Console.WriteLine(orders.Count(o => o.Price >= 4));
Console.WriteLine(orders.Sum(o => o.Price));
Console.WriteLine(orders.Max(o => o.Price));
Console.WriteLine($"{orders.Average(o => o.Price):F2}");

foreach (var group in orders.GroupBy(o => o.Category))
{
    Console.WriteLine($"{group.Key}: {group.Count()} orders, {group.Sum(o => o.Price)} dollars");
}

class Order
{
    public string Name { get; }
    public string Category { get; }
    public int Price { get; }

    public Order(string name, string category, int price)
    {
        Name = name;
        Category = category;
        Price = price;
    }
}
