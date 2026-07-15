Toolkit kit = new Toolkit();

Console.WriteLine("== Console Toolkit ==");
Console.WriteLine($"100 km = {kit.KmToMiles(100):F2} miles");
Console.WriteLine($"100 C = {kit.CelsiusToFahrenheit(100)} F");
Console.WriteLine($"3 hours = {kit.HoursToMinutes(3)} minutes");

class Toolkit
{
    public double KmToMiles(double km)
    {
        return km * 0.621371;
    }

    public double CelsiusToFahrenheit(double c)
    {
        return c * 9 / 5 + 32;
    }

    public int HoursToMinutes(int hours)
    {
        return hours * 60;
    }
}
