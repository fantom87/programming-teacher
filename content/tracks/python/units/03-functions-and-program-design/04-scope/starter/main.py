def add_tip(bill):
    tip = bill * 0.25
    total = bill + tip

add_tip(40.0)

# This line crashes — total only exists INSIDE add_tip:
print("Total with tip:", total)

# Fix it without moving the math out of the function:
# 1. return total from add_tip
# 2. dinner = add_tip(40.0)
# 3. print the line using dinner
