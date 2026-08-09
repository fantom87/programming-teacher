def t_load_source_reads_and_tags():
    import asyncio
    payload = asyncio.run(load_source("news"))
    assert payload["name"] == "news", "load_source should attach the source name to the payload"
    assert payload["headlines"][0] == "GIL made optional", "the payload should carry the fixture's data"
    weather = asyncio.run(load_source("weather"))
    assert weather["city"] == "Portland" and weather["latency_ms"] == 80, "each fixture loads its own file"

def t_fetch_all_keeps_call_order():
    import asyncio
    payloads = asyncio.run(fetch_all(["stocks", "news"]))
    assert [p["name"] for p in payloads] == ["stocks", "news"], "gather must return results in CALL order — stocks first even though it's slowest"

def t_fetch_all_overlaps():
    import asyncio, time
    start = time.perf_counter()
    asyncio.run(fetch_all(["weather", "news", "stocks"]))
    elapsed = time.perf_counter() - start
    assert elapsed < 0.22, f"three sources (40+80+120ms) took {elapsed:.3f}s — that's sequential; gather should finish near the slowest (~0.12s)"

def t_summarize_is_computed():
    payloads = [
        {"name": "weather", "latency_ms": 1, "city": "Oslo", "temp_c": 3, "sky": "snow"},
        {"name": "news", "latency_ms": 1, "headlines": ["quiet day"]},
        {"name": "stocks", "latency_ms": 1, "tickers": {"GO": 9.9, "TS": 5.1}},
    ]
    lines = summarize(payloads)
    assert lines == [
        "Oslo: 3C, snow",
        "1 headlines; top: quiet day",
        "best ticker: GO at 9.9",
    ], f"summarize must compute from whatever payloads it's given, got {lines}"

def t_summarize_ignores_payload_order():
    payloads = [
        {"name": "stocks", "latency_ms": 1, "tickers": {"AA": 1.0, "BB": 2.5}},
        {"name": "weather", "latency_ms": 1, "city": "Lima", "temp_c": 22, "sky": "sun"},
        {"name": "news", "latency_ms": 1, "headlines": ["a", "b"]},
    ]
    lines = summarize(payloads)
    assert lines[0] == "Lima: 22C, sun", "index payloads by name — don't assume weather is first"
    assert lines[2] == "best ticker: BB at 2.5", "the best ticker comes from max by value"

test("load_source reads its fixture and tags the name", t_load_source_reads_and_tags)
test("fetch_all preserves call order", t_fetch_all_keeps_call_order)
test("fetch_all overlaps the latencies", t_fetch_all_overlaps)
test("summarize computes everything it prints", t_summarize_is_computed)
test("summarize indexes by name, not position", t_summarize_ignores_payload_order)
