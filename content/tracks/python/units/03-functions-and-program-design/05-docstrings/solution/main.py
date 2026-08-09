def c_to_f(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32

def clamp(value, low, high):
    """Keep value inside the range low..high and return it."""
    if value < low:
        return low
    if value > high:
        return high
    return value

print(c_to_f.__doc__)
