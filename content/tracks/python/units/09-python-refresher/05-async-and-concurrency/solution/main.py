import asyncio


async def probe(name, delay, log):
    await asyncio.sleep(delay)
    log.append(name)
    return name


async def run_all(jobs):
    log = []
    results = await asyncio.gather(*(probe(name, delay, log) for name, delay in jobs))
    return results, log


async def with_timeout(coro, limit):
    try:
        return await asyncio.wait_for(coro, limit)
    except TimeoutError:
        return "timed out"


# Drill — leave these lines exactly as they are:
results, completed = asyncio.run(run_all([("db", 0.06), ("api", 0.02), ("cache", 0.04)]))
print(results)
print(completed)
print(asyncio.run(with_timeout(probe("slow", 0.2, []), 0.05)))
