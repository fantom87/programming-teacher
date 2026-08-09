Total_multiplies_unit_by_qty();
Total_applies_coupons();
Total_rejects_negative_qty();
Console.WriteLine($"{Check.Passed} passed, {Check.Failed} failed");

// [Fact] shape: arrange-act-assert, expected value precomputed.
void Total_multiplies_unit_by_qty()
{
    Check.Equal(30.00m, Price.Total(6.00m, 5), "Total_multiplies_unit_by_qty");
}

// [Theory]/[InlineData] shape: one body, many rows.
void Total_applies_coupons()
{
    foreach (var (coupon, expected) in new[] { ("SAVE10", 90.00m), ("HALF", 50.00m), ("BOGUS", 100.00m) })
    {
        Check.Equal(expected, Price.Total(10.00m, 10, coupon), $"coupon_{coupon}");
    }
}

// Assert.Throws shape: returning normally is the failure case.
void Total_rejects_negative_qty()
{
    try
    {
        Price.Total(10.00m, -1);
        Check.True(false, "Total_rejects_negative_qty");
    }
    catch (ArgumentOutOfRangeException)
    {
        Check.True(true, "Total_rejects_negative_qty");
    }
}

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
