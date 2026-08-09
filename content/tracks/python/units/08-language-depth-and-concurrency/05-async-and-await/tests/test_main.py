def t_step_is_coroutine_function():
    import inspect
    assert inspect.iscoroutinefunction(step), "step must be declared with async def"
    assert inspect.iscoroutinefunction(main), "main must be declared with async def"

def t_calling_does_not_run():
    coro = step("probe", 1)
    assert not isinstance(coro, str), "calling step() should make a coroutine object, not run the body"
    coro.close()

def t_step_returns_done_line():
    import asyncio
    assert asyncio.run(step("restore", 1)) == "restore done", "step should return f'{name} done'"
    assert asyncio.run(step("anything", 1)) == "anything done", "the name must come from the parameter"

def t_no_blocking_sleep():
    import inspect
    source = inspect.getsource(step) + inspect.getsource(main)
    assert "time.sleep" not in source, "time.sleep blocks the whole event loop — use await asyncio.sleep"

test("step and main are coroutine functions", t_step_is_coroutine_function)
test("calling a coroutine only creates it", t_calling_does_not_run)
test("step resolves to its done line", t_step_returns_done_line)
test("no blocking sleep anywhere", t_no_blocking_sleep)
