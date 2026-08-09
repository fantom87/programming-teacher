int[] ages = { 3, 9, 15, 30, 70 };

// 1. Write Category(int age) — its ENTIRE body one switch expression:
//      under 5           -> "free"
//      under 13          -> "child"
//      13 through 17     -> "teen"      (join two comparisons with `and`)
//      65 and up         -> "senior"
//      everything else   -> "adult"     (the discard: _)
//    Remember: arms are tried top to bottom, first match wins.
// 2. foreach over ages, printing:  {age}: {Category(age)}
//    No if/else anywhere in the file.
