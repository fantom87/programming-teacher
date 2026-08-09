import asyncio

# The async drill — three coroutines, clocked hard.

# 1. probe(name, delay, log) — ASYNC: await asyncio.sleep(delay),
#    append name to log (that records COMPLETION order), return name.

# 2. run_all(jobs) — ASYNC: jobs is a list of (name, delay) pairs.
#    Fresh log, every probe run CONCURRENTLY through one
#    asyncio.gather(*...), return (results, log).

# 3. with_timeout(coro, limit) — ASYNC: return await
#    asyncio.wait_for(coro, limit); on TimeoutError return "timed out".

# Drill — leave these lines exactly as they are:
results, completed = asyncio.run(run_all([("db", 0.06), ("api", 0.02), ("cache", 0.04)]))
print(results)
print(completed)
print(asyncio.run(with_timeout(probe("slow", 0.2, []), 0.05)))
