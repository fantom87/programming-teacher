def t_all_async():
    import inspect
    assert inspect.iscoroutinefunction(probe), "probe must be an async def"
    assert inspect.iscoroutinefunction(run_all), "run_all must be an async def"
    assert inspect.iscoroutinefunction(with_timeout), "with_timeout must be an async def"

def t_orders():
    import asyncio
    results, log = asyncio.run(run_all([("x", 0.03), ("y", 0.01)]))
    assert results == ["x", "y"], "gather returns results in ARGUMENT order, whatever finishes first"
    assert log == ["y", "x"], "the log records COMPLETION order — y (0.01s) beats x (0.03s)"

def t_empty():
    import asyncio
    assert asyncio.run(run_all([])) == ([], []), "no jobs: empty results, empty log"

def t_concurrent():
    import asyncio, time
    start = time.perf_counter()
    asyncio.run(run_all([("a", 0.08), ("b", 0.08), ("c", 0.08)]))
    elapsed = time.perf_counter() - start
    assert elapsed < 0.2, f"three 0.08s probes took {elapsed:.2f}s — sequential awaits? one gather should overlap them"

def t_timeout():
    import asyncio
    assert asyncio.run(with_timeout(probe("ok", 0.01, []), 1.0)) == "ok", "a fast coro's value passes straight through"
    assert asyncio.run(with_timeout(probe("slow", 0.5, []), 0.02)) == "timed out", "past the limit, wait_for raises TimeoutError — catch it"

test("everything is async def", t_all_async)
test("argument order vs completion order", t_orders)
test("empty gather", t_empty)
test("probes overlap", t_concurrent)
test("wait_for guards the slow path", t_timeout)
