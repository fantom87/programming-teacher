import asyncio
import json
from pathlib import Path

# The Async Aggregator — build it part by part.

# Part 1: load_source(name) — async.
#         Read and json-parse f"{name}.json", then
#         await asyncio.sleep(latency_ms / 1000) using the FILE's value,
#         print f"{name} loaded", return {"name": name, **data}.

# Part 2: fetch_all(names) — async.
#         ONE asyncio.gather over a load_source coroutine per name;
#         return its list (call order preserved).

# Part 3: summarize(payloads) — pure, no I/O, no prints.
#         Index payloads by name, return three computed lines:
#           "City: NC, sky"
#           "N headlines; top: first-headline"
#           "best ticker: T at price"   (max ticker by value)

# Part 4: main() — async.
#         Print "== Daily Digest ==",
#         payloads = await fetch_all(["weather", "news", "stocks"]),
#         print each summarize line, then f"{len(payloads)} sources aggregated".

# Finally, one driver:
# asyncio.run(main())
