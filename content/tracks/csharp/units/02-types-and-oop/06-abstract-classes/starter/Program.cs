// 1. Build a List<Shape> holding new Circle(3) and new Rectangle(4, 2.5),
//    then foreach over it calling Describe(). Expected:
//      Circle area: 28.27
//      Rectangle area: 10.00

// 2. Finish the abstract base:
//      - add: public abstract double Area();
//      - Describe stays here, written exactly once.
abstract class Shape
{
    public string Name { get; }

    public Shape(string name)
    {
        Name = name;
    }

    public void Describe()
    {
        Console.WriteLine($"{Name} area: {Area():F2}");
    }
}

// 3. Add Circle : Shape  — ctor takes radius, passes "Circle" to base, overrides Area (Math.PI * r * r)
// 4. Add Rectangle : Shape — ctor takes width + height, passes "Rectangle" to base, overrides Area
