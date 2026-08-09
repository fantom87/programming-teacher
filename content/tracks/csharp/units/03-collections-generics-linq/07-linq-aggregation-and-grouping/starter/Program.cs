// This morning's café orders.
List<Order> orders = new List<Order>
{
    new Order("Espresso", "drink", 3),
    new Order("Latte", "drink", 5),
    new Order("Bagel", "food", 4),
    new Order("Sandwich", "food", 9),
    new Order("Tea", "drink", 3),
};

// 1. Print how many orders cost 4 or more:  orders.Count(o => ...)
// 2. Print the Sum of all prices, then the Max price.
// 3. Print the Average price formatted with :F2  (expect 4.80).
// 4. GroupBy Category; for each group print:
//      drink: 3 orders, 11 dollars
//    using the group's Key, Count(), and Sum(...) — no hand-typed numbers.

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
