import functools
from contextlib import contextmanager


def chunks(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i:i + size]


def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print(f"call {fn.__name__}")
        return fn(*args, **kwargs)
    return wrapper


@contextmanager
def workspace(name):
    print(f"open {name}")
    try:
        yield name.upper()
    finally:
        print(f"close {name}")


@logged
def total(numbers):
    return sum(numbers)


# Drill — leave these lines exactly as they are:
print(list(chunks("abcdefg", 3)))
with workspace("scratch") as label:
    print(label)
print(total([2, 3, 4]))
