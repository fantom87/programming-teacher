def t_chunks_lazy():
    import types
    g = chunks("abcd", 2)
    assert isinstance(g, types.GeneratorType), "chunks must be a generator — yield, don't return a list"
    assert next(g) == "ab", "the first chunk of 'abcd' by 2 is 'ab'"

def t_chunks_values():
    assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]], "the last chunk runs short"
    assert list(chunks("", 3)) == [], "empty input yields nothing"

def t_wraps():
    assert total.__name__ == "total", "the decorated function lost its name — add functools.wraps to the wrapper"

def t_logged_delegates():
    import io
    from contextlib import redirect_stdout
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        result = total([10, 20])
    assert result == 30, "the wrapper must return whatever fn returns"
    assert buffer.getvalue() == "call total\n", f"expected exactly 'call total' before the call, got {buffer.getvalue()!r}"

def t_workspace_closes_on_error():
    import io
    from contextlib import redirect_stdout
    buffer = io.StringIO()
    try:
        with redirect_stdout(buffer):
            with workspace("boom") as label:
                assert label == "BOOM", "workspace should yield name.upper()"
                raise ValueError("kaboom")
    except ValueError:
        pass
    assert "close boom" in buffer.getvalue(), "close must print even when the body raises — is the close-print in a finally?"

test("chunks is lazy", t_chunks_lazy)
test("chunks slices correctly", t_chunks_values)
test("wraps preserves identity", t_wraps)
test("logged prints then delegates", t_logged_delegates)
test("workspace survives explosions", t_workspace_closes_on_error)
