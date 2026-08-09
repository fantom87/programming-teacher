# 1. Positive — a descriptor class:
#      __set_name__(self, owner, name) -> remember self.name
#      __get__(self, obj, objtype=None) -> obj.__dict__[self.name]
#      __set__(self, obj, value) -> ValueError(f"{self.name} must be positive")
#                                   if value <= 0, else store in obj.__dict__

# 2. Product:
#      price = Positive()      (class level!)
#      quantity = Positive()
#      __init__(self, name, price, quantity) assigns self.name/price/quantity
#      total — a @property: round(self.price * self.quantity, 2)

# 3. Demo:
#      book = Product("book", 12.50, 3); print(f"{book.name}: {book.total}")
#      book.price = 10.00; print the same line again
#      try book.quantity = -1 / except ValueError as e: print(f"blocked: {e}")
#      print(book.total)
