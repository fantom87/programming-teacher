Point a = new Point(3, 4);
Point b = a;
b.X = 99;

Console.WriteLine($"a = ({a.X}, {a.Y})");
Console.WriteLine($"b = ({b.X}, {b.Y})");

Point origin = new Point(0, 0);
Console.WriteLine($"a to origin: {a.DistanceTo(origin)}");

struct Point
{
    public double X { get; set; }
    public double Y { get; set; }

    public Point(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double DistanceTo(Point other)
    {
        double dx = X - other.X;
        double dy = Y - other.Y;
        return Math.Sqrt(dx * dx + dy * dy);
    }
}
