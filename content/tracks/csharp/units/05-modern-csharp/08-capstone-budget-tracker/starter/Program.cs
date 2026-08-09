// Capstone: one month of transactions -> a fully computed budget report.
// The ledger below is the ONLY data — every number in the output is computed.
List<Transaction> ledger = new List<Transaction>
{
    new Transaction(1,  "Paycheck",        "income",    2600.00m),
    new Transaction(3,  "Rent",            "housing",   -900.00m),
    new Transaction(5,  "Groceries",       "food",      -240.50m),
    new Transaction(9,  "Bus pass",        "transport",  -60.00m),
    new Transaction(12, "Concert tickets", "fun",       -180.00m),
    new Transaction(18, "Groceries",       "food",      -195.75m),
    new Transaction(24, "Coffee",          "food",       -80.00m),  // typo! really -8.00
    new Transaction(28, "Late fee",        "fees",       -35.00m),
};

// Part 0 — the correction. Records are immutable: REPLACE entry 6 with a
//   changed copy via a `with` expression. Do NOT edit the seed line above.

// Part 1 — headline. Write a Signed extension method on decimal (static
//   class at the bottom): "+2600.00" for positives, "-900.00" style for
//   negatives, always :F2. Then:
//     == Budget Report ==
//     Income: <sum of positive amounts, Signed>
//     Spent: <sum of negative amounts, Signed>
//     Net: <income + spent, Signed>

// Part 2 — blank line, then "-- By category --" and one GroupBy line per
//   category over the EXPENSES only:  <category>: <absolute sum, F2>

// Part 3 — blank line, then "-- Ledger --" and every transaction:
//     Day <day> <description>: <amount, Signed> [<Label(t)>]
//   Label is ONE switch expression: Amount > 0m -> "income";
//   Category "fees" -> "avoidable"; Amount < -150m -> "big ticket";
//   otherwise "everyday".

record Transaction(int Day, string Description, string Category, decimal Amount);
