def t_pair_menu():
    assert pair_menu(["a", "b", "c"]) == ["a + b", "a + c", "b + c"], "3 toppings make 3 pairs, in combinations order"
    assert pair_menu(["x", "y"]) == ["x + y"], "2 toppings make exactly 1 pair"
    assert len(pair_menu(["a", "b", "c", "d"])) == 6, "4 toppings make 6 pairs"

def t_product():
    assert product([2, 3, 4]) == 24, "product([2, 3, 4]) should be 24"
    assert product([7]) == 7, "a single number multiplies to itself"
    assert product([]) == 1, "an empty list folds to the starting value, 1"

def t_product_handles_zero():
    assert product([5, 0, 9]) == 0, "any zero in the list makes the product 0"

test("pair_menu lists every 2-topping pizza", t_pair_menu)
test("product folds a list into one number", t_product)
test("product survives a zero", t_product_handles_zero)
