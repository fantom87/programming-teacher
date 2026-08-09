// This top-level code is ready — it just needs your Rectangle class below.
Rectangle r = new Rectangle();
r.Width = 4;
r.Height = 2.5;
Console.WriteLine($"{r.Width} x {r.Height} = {r.Area}");

r.Width = 8;
Console.WriteLine($"{r.Width} x {r.Height} = {r.Area}");

// Define Rectangle here:
//   Width  — double auto-property { get; set; }
//   Height — double auto-property { get; set; }
//   Area   — computed property: Width * Height
