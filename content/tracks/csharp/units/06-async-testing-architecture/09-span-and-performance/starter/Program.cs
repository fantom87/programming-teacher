// Two ways to read the amount column out of CSV lines: Split (allocates an
// array + a string per field) and span slicing (allocates nothing). You'll
// write the span version, then measure both and print the receipts.
string[] lines =
{
    "2026-04-01,coffee,4.50",
    "2026-04-02,books,23.00",
    "2026-04-03,rent,180.00",
    "2026-04-04,lunch,12.25",
    "2026-04-05,taxi,18.00",
};

const int Rounds = 2000;

// 1. Write SumWithSpans(lines) next to SumWithSplit below: for each line,
//      ReadOnlySpan<char> span = line.AsSpan();
//    slice everything after span.LastIndexOf(',') and decimal.Parse the
//    slice. No Split, no Substring — windows, not copies.
// 2. Warm up: call SumWithSplit(lines) and SumWithSpans(lines) ONCE here,
//    before measuring, so the JIT compiles both outside your brackets.
// 3. Measure each path: long before = GC.GetAllocatedBytesForCurrentThread();
//    run the Rounds-loop keeping the returned total; subtract to get
//    splitBytes, then bracket the span loop the same way for spanBytes.
// 4. Print the header, both totals with :F2, then the computed verdicts:
//      $"split allocated: {splitBytes > 0}"
//      $"span allocated less: {spanBytes < splitBytes}"
// Output:
//   == Allocation lab ==
//   split total: 237.75
//   span total: 237.75
//   split allocated: True
//   span allocated less: True

static decimal SumWithSplit(string[] lines)
{
    decimal total = 0m;
    foreach (string line in lines)
    {
        total += decimal.Parse(line.Split(',')[2]);   // array + strings, per line
    }
    return total;
}
