List<Animal> shelter = new List<Animal>();
shelter.Add(new Dog("Rex"));
shelter.Add(new Cat("Mittens"));
shelter.Add(new Animal("Blob"));

foreach (Animal a in shelter)
{
    a.Speak();
}

class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }

    public virtual void Speak()
    {
        Console.WriteLine($"{Name} makes a sound.");
    }
}

class Dog : Animal
{
    public Dog(string name) : base(name)
    {
    }

    public override void Speak()
    {
        Console.WriteLine($"{Name} says woof!");
    }
}

class Cat : Animal
{
    public Cat(string name) : base(name)
    {
    }

    public override void Speak()
    {
        Console.WriteLine($"{Name} says meow!");
    }
}
