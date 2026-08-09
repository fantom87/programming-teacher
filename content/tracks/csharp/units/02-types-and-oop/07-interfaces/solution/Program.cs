List<IAlarm> alarms = new List<IAlarm>();
alarms.Add(new Rooster());
alarms.Add(new Phone());
alarms.Add(new Neighbor());

Console.WriteLine("Wake-up service:");
foreach (IAlarm alarm in alarms)
{
    alarm.Ring();
}

interface IAlarm
{
    void Ring();
}

class Rooster : IAlarm
{
    public void Ring()
    {
        Console.WriteLine("Cock-a-doodle-doo!");
    }
}

class Phone : IAlarm
{
    public void Ring()
    {
        Console.WriteLine("Beep beep beep!");
    }
}

class Neighbor : IAlarm
{
    public void Ring()
    {
        Console.WriteLine("Vrrrrrm. Vrrrrrm.");
    }
}
