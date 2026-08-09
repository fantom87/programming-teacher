class Positive:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        return obj.__dict__[self.name]

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive")
        obj.__dict__[self.name] = value


class Product:
    price = Positive()
    quantity = Positive()

    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

    @property
    def total(self):
        return round(self.price * self.quantity, 2)


book = Product("book", 12.50, 3)
print(f"{book.name}: {book.total}")
book.price = 10.00
print(f"{book.name}: {book.total}")
try:
    book.quantity = -1
except ValueError as e:
    print(f"blocked: {e}")
print(book.total)
