from inspect import signature
from typing import get_type_hints

CUSTOMERS = {7: "Ada Lovelace", 9: "Grace Hopper"}
LEDGER = []


# 1. Annotate all four functions — every parameter AND every return.
#    log_invoice returns nothing: that's "-> None", not "no annotation".
#    find_customer may return nothing at all: "str | None".

def parse_price(text):
    """Turn "12.50" into 12.5."""
    return float(text)


def apply_tax(amount, rate):
    """Add a tax rate expressed as a fraction: 0.2 means 20%."""
    return round(amount * (1 + rate), 2)


def find_customer(customer_id):
    """The customer's name, or nothing when there's no such id."""
    return CUSTOMERS.get(customer_id)


def log_invoice(name, total):
    """Record one invoice in the ledger."""
    LEDGER.append((name, total))


# 2. typecheck(fn, args) -> list of messages for THIS call.
#    - hints = get_type_hints(fn)            names -> annotated types
#    - bound = signature(fn).bind(*args)     names -> values passed
#    Loop bound.arguments. Skip any parameter whose annotation is not a
#    plain class (isinstance(expected, type)). Where the value isn't an
#    instance of it, append exactly:
#
#      f'error: Argument "{name}" to "{fn.__name__}" has incompatible '
#      f'type "{type(value).__name__}"; expected "{expected.__name__}"  [arg-type]'
#
#    (Two spaces before [arg-type] — mypy's own spacing.)


# 3. report(cases) — typecheck every (fn, args) pair in order, print
#    each message on its own line, then mypy's summary:
#      Found 2 errors in 1 file (checked 1 source file)
#      Found 1 error in 1 file (checked 1 source file)     <- singular
#      Success: no issues found in 1 source file           <- none at all


CASES = [
    (parse_price, ("12.50",)),
    (parse_price, (12,)),
    (apply_tax, (10.0, 0.2)),
    (apply_tax, (10.0, "0.2")),
    (find_customer, (7,)),
    (log_invoice, ("Ada Lovelace", 12.0)),
]

# 4. Call report(CASES).
