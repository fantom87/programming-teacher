def add_tip(bill):
    tip = bill * 0.25
    total = bill + tip
    return total

dinner = add_tip(40.0)

print("Total with tip:", dinner)
