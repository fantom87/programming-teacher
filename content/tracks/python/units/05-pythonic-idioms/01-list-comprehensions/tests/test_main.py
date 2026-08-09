def t_to_fahrenheit():
    assert to_fahrenheit([0, 100]) == [32.0, 212.0], "0 C and 100 C should become 32.0 and 212.0"
    assert to_fahrenheit([]) == [], "an empty list converts to an empty list"
    assert to_fahrenheit([-40]) == [-40.0], "-40 is where the two scales agree"

def t_long_words():
    assert long_words(["hi", "hello", "hey"], 2) == ["hello", "hey"], 'words longer than 2 letters: ["hello", "hey"]'
    assert long_words(["a", "b"], 5) == [], "nothing here is longer than 5 letters"
    assert long_words(["idiom", "loop", "comprehension", "list", "pythonic"], 6) == ["comprehension", "pythonic"], "the starter words longer than 6 letters"

def t_input_untouched():
    original = [10, 20]
    to_fahrenheit(original)
    assert original == [10, 20], "to_fahrenheit must build a NEW list, not change the input"

test("to_fahrenheit converts every temperature", t_to_fahrenheit)
test("long_words keeps only the long ones", t_long_words)
test("the input list is left untouched", t_input_untouched)
