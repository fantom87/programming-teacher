// A week of daily highs, in Celsius.
List<int> temps = new List<int> { 18, 24, 31, 15, 28, 35, 22 };

// 1. warm — temps.Where(...) keeping only values 25 and up.
//    foreach-print each one (original order).
// 2. labels — ONE chain on temps: Where (25 and up), OrderBy (ascending),
//    Select each t into $"{t}C". foreach-print each label.
