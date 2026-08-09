snacks = [
    {"name": "granola bar", "price": 2, "stock": 12},
    {"name": "trail mix", "price": 3, "stock": 0},
    {"name": "apple", "price": 1, "stock": 25},
    {"name": "cocoa", "price": 2, "stock": 0},
]
wish = "banana"

# Build the morning report — every number COMPUTED from snacks:
#
#   SNACK STAND REPORT
#   <name>: $<price> each, <stock> left        (one line per snack)
#   Sold out: <count of snacks with stock 0>
#   Stock value: $<sum of price * stock>
#
# Set up names = [], sold_out = 0, total_value = 0 before the loop.
# Last line: if wish is in names ->  <wish> today: yes
#            otherwise           ->  no <wish> today
