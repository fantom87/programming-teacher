Rectangle r = new Rectangle();
r.Width = 4;
r.Height = 2.5;
Console.WriteLine($"{r.Width} x {r.Height} = {r.Area}");

r.Width = 8;
Console.WriteLine($"{r.Width} x {r.Height} = {r.Area}");

class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
    public double Area => Width * Height;
}
