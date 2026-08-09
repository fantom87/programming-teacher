int[] ages = { 3, 9, 15, 30, 70 };

foreach (int age in ages)
{
    Console.WriteLine($"{age}: {Category(age)}");
}

string Category(int age) => age switch
{
    < 5 => "free",
    < 13 => "child",
    >= 13 and < 18 => "teen",
    >= 65 => "senior",
    _ => "adult",
};
