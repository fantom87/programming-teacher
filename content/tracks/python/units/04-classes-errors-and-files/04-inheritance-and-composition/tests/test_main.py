def t_employee_pay():
    e = Employee("Test", 10)
    assert e.weekly_pay() == 400, f"Employee('Test', 10).weekly_pay() gave {e.weekly_pay()!r}, expected 400"

def t_manager_is_employee():
    assert issubclass(Manager, Employee), "Manager should inherit from Employee — class Manager(Employee):"

def t_manager_init():
    m = Manager("Test", 10, 55)
    assert m.name == "Test", "Manager lost its name — call super().__init__(name, hourly_rate)"
    assert m.hourly_rate == 10, "Manager lost its hourly_rate — call super().__init__(name, hourly_rate)"
    assert m.bonus == 55, f"bonus holds {m.bonus!r}, expected 55"

def t_manager_pay():
    m = Manager("Test", 10, 55)
    assert m.weekly_pay() == 455, f"Manager('Test', 10, 55).weekly_pay() gave {m.weekly_pay()!r}, expected 455"

test("Employee.weekly_pay is rate x 40", t_employee_pay)
test("Manager inherits from Employee", t_manager_is_employee)
test("Manager keeps name and rate via super()", t_manager_init)
test("Manager.weekly_pay adds the bonus", t_manager_pay)
