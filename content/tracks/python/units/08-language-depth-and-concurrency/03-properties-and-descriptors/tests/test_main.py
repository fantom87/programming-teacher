def t_total_is_property():
    assert isinstance(Product.total, property), "total should be a @property, not a stored attribute"
    p = Product("widget", 2.0, 4)
    assert p.total == 8.0, "total should compute price * quantity"

def t_total_recomputes():
    p = Product("widget", 3.0, 3)
    p.price = 2.0
    assert p.total == 6.0, "total must recompute from live values — don't store it in __init__"

def t_descriptor_blocks_bad_values():
    p = Product("widget", 1.0, 1)
    try:
        p.price = -5
    except ValueError:
        pass
    else:
        raise AssertionError("setting price to -5 should raise ValueError")
    assert p.price == 1.0, "a rejected assignment must leave the old value in place"

def t_descriptor_knows_its_name():
    p = Product("widget", 1.0, 1)
    try:
        p.quantity = 0
    except ValueError as e:
        assert "quantity" in str(e), f"the error should name the attribute via __set_name__, got: {e}"
    else:
        raise AssertionError("quantity = 0 should raise ValueError (zero is not positive)")

def t_one_class_two_attributes():
    assert isinstance(vars(Product)["price"], Positive), "price should be a class-level Positive()"
    assert isinstance(vars(Product)["quantity"], Positive), "quantity should be a class-level Positive()"

test("total is a computed property", t_total_is_property)
test("total recomputes on every read", t_total_recomputes)
test("Positive rejects non-positive values", t_descriptor_blocks_bad_values)
test("__set_name__ puts the right name in the error", t_descriptor_knows_its_name)
test("one descriptor class guards both attributes", t_one_class_two_attributes)
