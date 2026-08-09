// 1. Point a = new Point(3, 4); copy it into b; set b.X = 99; then print:
//      a = (3, 4)
//      b = (99, 4)
//    (format each as: $"a = ({a.X}, {a.Y})")

// 2. Make an origin point (0, 0) and print:
//      a to origin: 5
//    using a.DistanceTo(origin) — no hard-coded 5!

// Define the struct below (note the keyword — everything inside looks like a class):
//   struct Point
//     X, Y        — double properties
//     constructor — sets both
//     DistanceTo  — dx = X - other.X; dy = Y - other.Y; Math.Sqrt(dx*dx + dy*dy)
