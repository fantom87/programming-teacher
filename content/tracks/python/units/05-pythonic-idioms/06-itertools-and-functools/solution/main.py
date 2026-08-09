from itertools import chain, combinations
from functools import reduce

morning = ["review PRs", "standup"]
afternoon = ["deep work", "code review"]
toppings = ["pesto", "olive", "feta"]

for slot, task in enumerate(chain(morning, afternoon), start=1):
    print(f"{slot}. {task}")

def pair_menu(toppings):
    return [f"{a} + {b}" for a, b in combinations(toppings, 2)]

def product(numbers):
    return reduce(lambda total, n: total * n, numbers, 1)

for pair in pair_menu(toppings):
    print(pair)

print(product([2, 3, 4]))
