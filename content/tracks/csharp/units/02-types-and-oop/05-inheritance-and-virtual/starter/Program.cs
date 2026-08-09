// 1. Build a List<Animal> holding: new Dog("Rex"), new Cat("Mittens"), new Animal("Blob")
// 2. foreach over the list calling Speak() on each — expected output:
//      Rex says woof!
//      Mittens says meow!
//      Blob makes a sound.

// The base class is done. Add Dog and Cat below it:
//   each forwards its constructor with : base(name)
//   each overrides Speak — "says woof!" / "says meow!"
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
