// dotnet test, approximated: Check plays xUnit's Assert, the driver plays the
// runner. Harness, Price, and driver are FINISHED — you write the three tests.

Total_multiplies_unit_by_qty();
Total_applies_coupons();
Total_rejects_negative_qty();
Console.WriteLine($"{Check.Passed} passed, {Check.Failed} failed");

// TODO [Fact]: void Total_multiplies_unit_by_qty() — Check.Equal an expected
// total YOU computed (6.00m at qty 5 is 30.00m) against Price.Total.

// TODO [Theory]: void Total_applies_coupons() — loop (coupon, expected) cases
//   ("SAVE10", 90.00m), ("HALF", 50.00m), ("BOGUS", 100.00m)
// on a 10.00m x 10 order; name each result $"coupon_{coupon}".

// TODO [Fact] + Assert.Throws: void Total_rejects_negative_qty() — call
// Price.Total(10.00m, -1) in a try; if it RETURNS, Check.True(false, ...);
// catch (ArgumentOutOfRangeException) => Check.True(true, ...).

// ---- code under test (do not edit) ----
static class Price
{
    public static decimal Total(decimal unitPrice, int qty, string? coupon = null)
    {
        if (qty < 0) throw new ArgumentOutOfRangeException(nameof(qty));
        decimal total = unitPrice * qty;
        return coupon switch
        {
            "SAVE10" => total * 0.90m,
            "HALF" => total * 0.50m,
            _ => total,
        };
    }
}

// ---- tiny assert harness (do not edit) ----
static class Check
{
    public static int Passed;
    public static int Failed;

    public static void Equal(decimal expected, decimal actual, string name)
    {
        if (expected == actual) { Passed++; Console.WriteLine($"PASS {name}"); }
        else { Failed++; Console.WriteLine($"FAIL {name}: expected {expected} got {actual}"); }
    }

    public static void True(bool condition, string name)
    {
        if (condition) { Passed++; Console.WriteLine($"PASS {name}"); }
        else { Failed++; Console.WriteLine($"FAIL {name}"); }
    }
}
