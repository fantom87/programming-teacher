from inspect import signature
from typing import get_type_hints

CUSTOMERS = {7: "Ada Lovelace", 9: "Grace Hopper"}
LEDGER = []


def parse_price(text: str) -> float:
    """Turn "12.50" into 12.5."""
    return float(text)


def apply_tax(amount: float, rate: float) -> float:
    """Add a tax rate expressed as a fraction: 0.2 means 20%."""
    return round(amount * (1 + rate), 2)


def find_customer(customer_id: int) -> str | None:
    """The customer's name, or nothing when there's no such id."""
    return CUSTOMERS.get(customer_id)


def log_invoice(name: str, total: float) -> None:
    """Record one invoice in the ledger."""
    LEDGER.append((name, total))


def typecheck(fn, args):
    """Check one call against the function's annotations, mypy style."""
    hints = get_type_hints(fn)
    bound = signature(fn).bind(*args)
    messages = []
    for name, value in bound.arguments.items():
        expected = hints.get(name)
        if isinstance(expected, type) and not isinstance(value, expected):
            messages.append(
                f'error: Argument "{name}" to "{fn.__name__}" has incompatible '
                f'type "{type(value).__name__}"; expected "{expected.__name__}"  [arg-type]'
            )
    return messages


def report(cases):
    """Check every call and print mypy's report."""
    messages = []
    for fn, args in cases:
        messages.extend(typecheck(fn, args))
    for message in messages:
        print(message)
    if messages:
        plural = "error" if len(messages) == 1 else "errors"
        print(f"Found {len(messages)} {plural} in 1 file (checked 1 source file)")
    else:
        print("Success: no issues found in 1 source file")


CASES = [
    (parse_price, ("12.50",)),
    (parse_price, (12,)),
    (apply_tax, (10.0, 0.2)),
    (apply_tax, (10.0, "0.2")),
    (find_customer, (7,)),
    (log_invoice, ("Ada Lovelace", 12.0)),
]

report(CASES)
