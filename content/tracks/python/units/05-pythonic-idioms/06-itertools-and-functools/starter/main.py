from itertools import chain, combinations
from functools import reduce

morning = ["review PRs", "standup"]
afternoon = ["deep work", "code review"]
toppings = ["pesto", "olive", "feta"]

# 1. One loop over enumerate(chain(morning, afternoon), start=1):
#    print "1. review PRs" ... "4. code review".

# 2. pair_menu(toppings) — RETURN a list like "pesto + olive" for every
#    2-topping combination. Then print each entry.

# 3. product(numbers) — RETURN the numbers multiplied together using
#    reduce, starting from 1. Then print product([2, 3, 4]).
