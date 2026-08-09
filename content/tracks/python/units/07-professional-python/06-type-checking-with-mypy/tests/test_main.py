def t_every_function_is_annotated():
    import typing
    from typing import get_type_hints
    price = get_type_hints(parse_price)
    assert price.get("text") is str, "parse_price takes a str"
    assert price.get("return") is float, "parse_price returns a float"
    tax = get_type_hints(apply_tax)
    assert tax.get("amount") is float and tax.get("rate") is float, "apply_tax takes two floats"
    assert tax.get("return") is float, "apply_tax returns a float"
    customer = get_type_hints(find_customer)
    assert customer.get("customer_id") is int, "find_customer takes an int id"
    assert customer.get("return") == typing.Optional[str], "find_customer can come back empty — annotate it str | None"
    log = get_type_hints(log_invoice)
    assert log.get("name") is str and log.get("total") is float, "log_invoice takes a name and a total"
    assert log.get("return") is type(None), "a function that returns nothing is annotated -> None"

def t_good_calls_are_silent():
    for fn, args in [(parse_price, ("12.50",)), (apply_tax, (10.0, 0.2)),
                     (find_customer, (7,)), (log_invoice, ("Ada", 12.0))]:
        assert typecheck(fn, args) == [], f"{fn.__name__}{args} matches its annotations — no message expected"

def t_bad_argument_is_reported():
    messages = typecheck(parse_price, (12,))
    assert len(messages) == 1, f"one bad argument is one message, got {messages}"
    expected = 'error: Argument "text" to "parse_price" has incompatible type "int"; expected "str"  [arg-type]'
    assert messages[0] == expected, f"expected:\n  {expected}\ngot:\n  {messages[0]}"

def t_checker_reads_the_annotations():
    messages = typecheck(log_invoice, (7, "twelve"))
    assert len(messages) == 2, f"both arguments are wrong here, got {messages}"
    assert 'Argument "name"' in messages[0] and '"int"; expected "str"' in messages[0], f"first message wrong: {messages[0]}"
    assert 'Argument "total"' in messages[1] and '"str"; expected "float"' in messages[1], f"second message wrong: {messages[1]}"

def t_union_annotations_are_skipped():
    assert typecheck(find_customer, (9,)) == [], "an int id is fine"
    messages = typecheck(find_customer, ("9",))
    assert len(messages) == 1 and '"str"; expected "int"' in messages[0], f"only customer_id is checkable here, got {messages}"

def t_report_counts_and_pluralises():
    import contextlib, io
    def capture(cases):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            report(cases)
        return buf.getvalue()
    one = capture([(parse_price, (12,))]).strip().splitlines()
    assert one[-1] == "Found 1 error in 1 file (checked 1 source file)", f"one error is singular, got {one[-1]!r}"
    clean = capture([(parse_price, ("1.0",))]).strip().splitlines()
    assert clean[-1] == "Success: no issues found in 1 source file", f"a clean run should print mypy's success line, got {clean[-1]!r}"
    assert len(clean) == 1, f"a clean run prints only the success line, got {clean}"
    many = capture(CASES).strip().splitlines()
    assert len(many) == 3, f"the case table produces two errors and a summary, got {many}"
    assert many[-1] == "Found 2 errors in 1 file (checked 1 source file)", f"two errors is plural, got {many[-1]!r}"

test("all four functions are annotated", t_every_function_is_annotated)
test("well-typed calls produce nothing", t_good_calls_are_silent)
test("a bad argument gets mypy's exact message", t_bad_argument_is_reported)
test("every argument of a call is checked", t_checker_reads_the_annotations)
test("union annotations are left alone", t_union_annotations_are_skipped)
test("the report counts and pluralises", t_report_counts_and_pluralises)
