List<Package> packages = new List<Package>
{
    new Package("Oslo", 25, true),
    new Package("Lisbon", 3, true),
    new Package("Prague", 40, false),
    new Package("local", 1, false),
    new Package("Madrid", 8, false),
};

// 1. Write Label(Package p) — ONE switch expression on p, arms in this order:
//      express AND over 20 kg    -> "express heavy"   ({ Express: true, Kg: > 20 })
//      express                   -> "express"
//      over 20 kg                -> "freight"
//      destination "local"       -> "courier"
//      everything else           -> "standard"        (discard)
// 2. foreach over packages, printing:  {Destination}: {Label(p)}
// 3. If packages[0] `is` express (use an `is` PROPERTY PATTERN, not ==),
//    print:  first flies tonight

record Package(string Destination, double Kg, bool Express);
