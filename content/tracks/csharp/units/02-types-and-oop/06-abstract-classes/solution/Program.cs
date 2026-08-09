List<Shape> shapes = new List<Shape>();
shapes.Add(new Circle(3));
shapes.Add(new Rectangle(4, 2.5));

foreach (Shape s in shapes)
{
    s.Describe();
}

abstract class Shape
{
    public string Name { get; }

    public Shape(string name)
    {
        Name = name;
    }

    public abstract double Area();

    public void Describe()
    {
        Console.WriteLine($"{Name} area: {Area():F2}");
    }
}

class Circle : Shape
{
    public double Radius { get; }

    public Circle(double radius) : base("Circle")
    {
        Radius = radius;
    }

    public override double Area()
    {
        return Math.PI * Radius * Radius;
    }
}

class Rectangle : Shape
{
    public double Width { get; }
    public double Height { get; }

    public Rectangle(double width, double height) : base("Rectangle")
    {
        Width = width;
        Height = height;
    }

    public override double Area()
    {
        return Width * Height;
    }
}
