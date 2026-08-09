# 1. Define ticket(name, row="general", price=25) — it RETURNS one line:
#      f"{name} | {row} | ${price}"

# 2. Print three tickets:
#      ticket("Ada")                    -> Ada | general | $25
#      ticket("Grace", "balcony", 40)   -> Grace | balcony | $40
#      Linus, price 60, default row     -> Linus | general | $60
#    (for Linus, use a keyword argument: price=60)
