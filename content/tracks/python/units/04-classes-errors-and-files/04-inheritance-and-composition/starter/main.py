class Employee:
    def __init__(self, name, hourly_rate):
        self.name = name
        self.hourly_rate = hourly_rate

    def weekly_pay(self):
        return self.hourly_rate * 40


# 1. Define Manager(Employee): __init__ takes name, hourly_rate, bonus.
#    Call super().__init__(name, hourly_rate), then store the bonus.

# 2. Override weekly_pay: the Employee pay PLUS the bonus.


# 3. Uncomment, then print each member as "name: $pay" using one loop.
# team = [Employee("Sam", 20), Manager("Alex", 30, 200)]
