// scores.txt holds one "name,score" row per line — and one row is corrupt.
// Import the good rows, skip the bad one BY NAME, and keep the tally.

// 1. string[] rows = File.ReadAllLines("scores.txt");
// 2. foreach row: Split(',') -> parts[0] is the name, parts[1] the score text.
//    try     { int.Parse the score; add to total; count it;
//              print:  Imported <name>: <score> }
//    catch (FormatException)
//            { print:  Skipped <name>: not a number }
// 3. After the loop:
//      Team total: <total> (<imported> of <rows.Length> rows)
