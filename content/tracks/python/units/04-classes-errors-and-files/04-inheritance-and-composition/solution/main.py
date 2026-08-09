class Employee:
    def __init__(self, name, hourly_rate):
        self.name = name
        self.hourly_rate = hourly_rate

    def weekly_pay(self):
        return self.hourly_rate * 40


class Manager(Employee):
    def __init__(self, name, hourly_rate, bonus):
        super().__init__(name, hourly_rate)
        self.bonus = bonus

    def weekly_pay(self):
        return super().weekly_pay() + self.bonus


team = [Employee("Sam", 20), Manager("Alex", 30, 200)]

for person in team:
    print(f"{person.name}: ${person.weekly_pay()}")
