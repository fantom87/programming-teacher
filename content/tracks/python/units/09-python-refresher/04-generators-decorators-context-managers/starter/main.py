import functools
from contextlib import contextmanager

# The wrapping trio.

# 1. chunks(seq, size) — GENERATOR yielding size-sized slices,
#    last one may run short. Step with range(0, len(seq), size).

# 2. logged(fn) — decorator printing "call <name>" before delegating.
#    functools.wraps mandatory. Then decorate total below.

# 3. workspace(name) — @contextmanager printing "open <name>",
#    yielding name.upper(), printing "close <name>" in a finally.

def total(numbers):  # decorate me with @logged
    return sum(numbers)

# Drill — leave these lines exactly as they are:
print(list(chunks("abcdefg", 3)))
with workspace("scratch") as label:
    print(label)
print(total([2, 3, 4]))
