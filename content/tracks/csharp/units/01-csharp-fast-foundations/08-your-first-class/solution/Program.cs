Dog rex = new Dog("Rex", 3);
rex.Describe();

Dog bella = new Dog("Bella", 5);
bella.Describe();

class Dog
{
    string name;
    int age;

    public Dog(string name, int age)
    {
        this.name = name;
        this.age = age;
    }

    public void Describe()
    {
        Console.WriteLine($"{name} is {age} years old.");
    }
}
