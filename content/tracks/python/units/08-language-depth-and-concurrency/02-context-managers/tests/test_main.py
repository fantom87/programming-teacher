def t_brackets_a_block():
    import io
    from contextlib import redirect_stdout
    buf = io.StringIO()
    with redirect_stdout(buf):
        with Section("test"):
            print("inside")
    assert buf.getvalue() == "== test ==\ninside\n== end test ==\n", f"got {buf.getvalue()!r}"

def t_exit_runs_on_error():
    import io
    from contextlib import redirect_stdout
    buf = io.StringIO()
    survived = False
    try:
        with redirect_stdout(buf):
            with Section("boom"):
                raise RuntimeError("kaboom")
    except RuntimeError:
        survived = True
    assert "== end boom ==" in buf.getvalue(), "__exit__ must run even when the block raises"
    assert survived, "__exit__ must NOT swallow the exception — return None, not True"

def t_muted_swallows_its_type():
    import io
    from contextlib import redirect_stdout
    buf = io.StringIO()
    with redirect_stdout(buf):
        with muted(ZeroDivisionError):
            1 / 0
    assert buf.getvalue() == "recovered\n", "muted should catch its exception type and print recovered"

def t_muted_ignores_other_types():
    try:
        with muted(ZeroDivisionError):
            {}["missing"]
    except KeyError:
        return
    raise AssertionError("muted(ZeroDivisionError) must not swallow a KeyError")

test("Section brackets the block with header and footer", t_brackets_a_block)
test("__exit__ runs on errors and lets them propagate", t_exit_runs_on_error)
test("muted swallows exactly its exception type", t_muted_swallows_its_type)
test("muted lets other exceptions through", t_muted_ignores_other_types)
