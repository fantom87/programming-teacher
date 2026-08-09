# These two functions work — but a stranger reading only their names
# gets no help. Give each a one-line docstring (the FIRST line of the
# body, in """triple quotes""").

def c_to_f(celsius):
    return celsius * 9 / 5 + 32

def clamp(value, low, high):
    if value < low:
        return low
    if value > high:
        return high
    return value

# Then ask Python to show one back:
#   print(c_to_f.__doc__)
