import functools


def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        arglist = ", ".join(repr(a) for a in args)
        print(f"calling {func.__name__}({arglist})")
        return func(*args, **kwargs)
    return wrapper


@logged
def add(a, b):
    """Add two numbers."""
    return a + b


@logged
def shout(word):
    """Uppercase with a bang."""
    return word.upper() + "!"


print(add(2, 3))
print(shout("ship"))
print(add.__name__)
print(add.__doc__)
