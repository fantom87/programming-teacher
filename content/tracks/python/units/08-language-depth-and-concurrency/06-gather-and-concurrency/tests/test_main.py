def t_fetch_is_async():
    import inspect
    assert inspect.iscoroutinefunction(fetch), "fetch must be async def"
    assert inspect.iscoroutinefunction(main), "main must be async def"

def t_fetch_resolves():
    import asyncio
    assert asyncio.run(fetch("probe", 1)) == "probe data", "fetch should return f'{source} data'"

def t_results_in_call_order():
    import asyncio
    async def go():
        return await asyncio.gather(fetch("slow", 60), fetch("quick", 10))
    assert asyncio.run(go()) == ["slow data", "quick data"], "gather must keep CALL order in its results, even though quick finishes first"

def t_actually_concurrent():
    import asyncio, time
    async def go():
        await asyncio.gather(fetch("a", 80), fetch("b", 80), fetch("c", 80))
    start = time.perf_counter()
    asyncio.run(go())
    elapsed = time.perf_counter() - start
    assert elapsed < 0.2, f"three 80ms fetches took {elapsed:.3f}s — they ran one after another; gather should overlap them (~0.08s)"

test("fetch and main are coroutine functions", t_fetch_is_async)
test("fetch resolves to its data", t_fetch_resolves)
test("results come back in call order", t_results_in_call_order)
test("the trio overlaps instead of queueing", t_actually_concurrent)
