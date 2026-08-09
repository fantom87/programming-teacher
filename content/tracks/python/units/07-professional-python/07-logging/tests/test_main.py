import contextlib as _contextlib
import io as _io
import logging as _logging

def _capture(level, work):
    """Run work() with the logger freshly set up against a captured stdout."""
    buf = _io.StringIO()
    with _contextlib.redirect_stdout(buf):
        setup_logging(level)
        work()
    return buf.getvalue()

def t_handler_and_formatter():
    setup_logging(_logging.DEBUG)
    logger = _logging.getLogger(LOGGER_NAME)
    assert len(logger.handlers) == 1, f"the checkout logger should have exactly one handler, found {len(logger.handlers)}"
    assert isinstance(logger.handlers[0], _logging.StreamHandler), "records should go through a StreamHandler"
    assert logger.propagate is False, "set propagate = False so records don't also climb to the root logger"
    record = _logging.LogRecord(LOGGER_NAME, _logging.INFO, "f.py", 1, "hello", None, None)
    line = logger.handlers[0].formatter.format(record)
    assert line == "INFO     checkout: hello", f"the formatter should produce 'INFO     checkout: hello' (levelname padded to 8), got {line!r}"

def t_setup_does_not_stack_handlers():
    setup_logging(_logging.INFO)
    setup_logging(_logging.INFO)
    logger = _logging.getLogger(LOGGER_NAME)
    assert len(logger.handlers) == 1, f"calling setup_logging twice must not stack handlers — found {len(logger.handlers)}, so every line would print twice"

def t_levels_are_chosen_well():
    out = _capture(_logging.DEBUG, lambda: process_order({"id": "B-1", "total": 42.5}))
    assert "DEBUG    checkout: validating order B-1" in out, f"a debug line should narrate validation, got {out!r}"
    assert "INFO     checkout: order B-1 accepted: 42.50" in out, f"an accepted order logs at INFO, got {out!r}"
    assert "WARNING" not in out and "ERROR" not in out, f"a normal order is neither a warning nor an error, got {out!r}"

def t_large_orders_warn_and_pass():
    out = _capture(_logging.INFO, lambda: process_order({"id": "B-2", "total": 980.0}))
    assert "WARNING  checkout: order B-2 is unusually large: 980.00" in out, f"expected a WARNING line for the large order, got {out!r}"
    assert "INFO     checkout: order B-2 accepted: 980.00" in out, f"a large order is still accepted, got {out!r}"

def t_bad_orders_error_and_stop():
    result = None
    def work():
        nonlocal result
        result = process_order({"id": "B-3", "total": 0.0})
    out = _capture(_logging.INFO, work)
    assert result is False, "an order with a non-positive total should return False"
    assert "ERROR    checkout: order B-3 rejected: total 0.00 is not positive" in out, f"expected the ERROR line, got {out!r}"
    assert "accepted" not in out, f"a rejected order must not also log as accepted, got {out!r}"

def t_level_actually_filters():
    quiet = _capture(_logging.WARNING, lambda: process_order({"id": "B-4", "total": 42.5}))
    assert quiet == "", f"at WARNING nothing about a normal order should appear, got {quiet!r}"
    normal = _capture(_logging.INFO, lambda: process_order({"id": "B-5", "total": 42.5}))
    assert "DEBUG" not in normal, f"at INFO the debug line must be filtered out, got {normal!r}"

def t_arguments_are_lazy():
    class Loud:
        def __init__(self):
            self.rendered = 0
        def __str__(self):
            self.rendered += 1
            return "B-6"
    loud = Loud()
    _capture(_logging.INFO, lambda: process_order({"id": loud, "total": 42.5}))
    assert loud.rendered == 1, (
        f"the id was turned into text {loud.rendered} times; at INFO only the accepted line is emitted, "
        "so pass values as %s arguments instead of building f-strings the logger may throw away"
    )

test("the handler and formatter are configured", t_handler_and_formatter)
test("setup_logging can be called twice", t_setup_does_not_stack_handlers)
test("levels match what happened", t_levels_are_chosen_well)
test("large orders warn but pass", t_large_orders_warn_and_pass)
test("bad orders error and return False", t_bad_orders_error_and_stop)
test("the level filters quieter messages", t_level_actually_filters)
test("log arguments stay lazy", t_arguments_are_lazy)
