---
id: 09-capstone-async-aggregator
title: "Capstone: Async Aggregator"
language: python
runner: local
estMinutes: 38
files:
  - path: main.py
    starter: starter/main.py
  - path: weather.json
    starter: starter/weather.json
  - path: news.json
    starter: starter/news.json
  - path: stocks.json
    starter: starter/stocks.json
goal: "Build an async multi-source aggregator: load_source reads a fixture and sleeps its declared latency, fetch_all gathers every source concurrently, summarize computes a digest from the payloads alone, and main assembles the printed report — every line computed."
docs: [python/stdlib-tour, python/files, python/dicts]
checks:
  - id: aggregator-works-on-any-data
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: daily-digest
    type: stdout
    entry: main.py
    match: exact
    value: "== Daily Digest ==\nnews loaded\nweather loaded\nstocks loaded\nPortland: 18C, clouds\n3 headlines; top: GIL made optional\nbest ticker: PY at 3.12\n3 sources aggregated\n"
  - id: everything-computed
    type: ai-judge
    rubric: "load_source(name) builds the filename from its argument, parses the JSON with json.loads (or json.load), awaits asyncio.sleep driven by the file's latency_ms value (no hardcoded sleep durations), prints f'{name} loaded' only after the sleep, and returns the parsed dict with the name attached. fetch_all awaits ONE asyncio.gather over load_source coroutines built from its names argument (comprehension or explicit calls — but never sequential awaits). summarize is pure: no I/O, no print, no asyncio — it indexes payloads by name and computes all three lines from the data: city/temp/sky interpolated, len() of headlines with headlines[0], and the best ticker via max(tickers, key=tickers.get) with its price read from the dict. main gathers via fetch_all, prints summarize's lines, and computes the footer from len of the payloads. None of the literals Portland, 18, clouds, 3, GIL made optional, PY, or 3.12 appears in main.py. time.sleep is absent; exactly one asyncio.run(main()) drives the file."
hints:
  - "Part 1: async def load_source(name): data = json.loads(Path(f\"{name}.json\").read_text(encoding=\"utf-8\")); await asyncio.sleep(data[\"latency_ms\"] / 1000); print(f\"{name} loaded\"); return {\"name\": name, **data}."
  - "Part 2 is one line of body: return await asyncio.gather(*(load_source(n) for n in names)) — the * unpacks one coroutine per name into gather, so call order in, result order out."
  - "Part 3: by = {p[\"name\"]: p for p in payloads}, then build the three f-strings from by[\"weather\"], by[\"news\"], by[\"stocks\"] — the best ticker is max(tickers, key=tickers.get). Part 4 just prints: header, fetch_all([\"weather\", \"news\", \"stocks\"]), each summarize line, then f\"{len(payloads)} sources aggregated\"."
---
## The aggregator

This is the Advanced capstone: the shape behind every dashboard,
portfolio page, and morning-brief bot ever shipped — *n* slow sources,
one fast page. The sources here are local JSON fixtures, each
declaring its own simulated `latency_ms`, so the concurrency is real
but the data never leaves your disk. Everything in it is this unit,
composed: coroutines that sleep like network calls, one `gather` doing
the waiting, a pure function crunching payloads, and threads' lesson
in determinism — completion order for arrival lines, call order for
results. The capstone rule stands: **every printed value is computed
from the fixtures.** Swap in tomorrow's news and nothing changes but
the output.

### Your goal

Running the file must print exactly:

```
== Daily Digest ==
news loaded
weather loaded
stocks loaded
Portland: 18C, clouds
3 headlines; top: GIL made optional
best ticker: PY at 3.12
3 sources aggregated
```

**Part 1 — the source.** `async def load_source(name)`: read
`{name}.json`, parse it, `await asyncio.sleep(latency_ms / 1000)`
using the *file's* latency, print `{name} loaded`, and return the
payload dict with `"name": name` added. The arrival lines order
themselves by latency — news (40) before weather (80) before stocks
(120).

**Part 2 — the fan-out.** `async def fetch_all(names)`: one
`asyncio.gather` over a `load_source` coroutine per name. Returns
payloads in *call* order, whatever the latencies.

**Part 3 — the brains.** `summarize(payloads)` — a plain, pure
function returning the three digest lines: weather as
`City: NC, sky`, news as `N headlines; top: first`, stocks as
`best ticker: T at price` with the best ticker found by `max` with a
key. No I/O, no prints — the tests feed it invented payloads.

**Part 4 — the assembly.** `async def main()`: header, fetch all
three sources, print each summary line, close with the computed
source count. One `asyncio.run(main())` at the bottom.

The tests rerun your pieces against different fixtures and clock the
fan-out to prove it overlaps. Green here means the Advanced tier is
yours.
