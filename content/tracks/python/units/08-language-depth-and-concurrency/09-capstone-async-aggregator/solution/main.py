import asyncio
import json
from pathlib import Path


async def load_source(name):
    """One simulated network source: read the fixture, wait its latency."""
    data = json.loads(Path(f"{name}.json").read_text(encoding="utf-8"))
    await asyncio.sleep(data["latency_ms"] / 1000)
    print(f"{name} loaded")
    return {"name": name, **data}


async def fetch_all(names):
    """Fan out: every source at once, results in call order."""
    return await asyncio.gather(*(load_source(name) for name in names))


def summarize(payloads):
    """Pure crunching: payloads in, digest lines out."""
    by = {p["name"]: p for p in payloads}
    weather = by["weather"]
    news = by["news"]
    tickers = by["stocks"]["tickers"]
    best = max(tickers, key=tickers.get)
    return [
        f"{weather['city']}: {weather['temp_c']}C, {weather['sky']}",
        f"{len(news['headlines'])} headlines; top: {news['headlines'][0]}",
        f"best ticker: {best} at {tickers[best]}",
    ]


async def main():
    print("== Daily Digest ==")
    payloads = await fetch_all(["weather", "news", "stocks"])
    for line in summarize(payloads):
        print(line)
    print(f"{len(payloads)} sources aggregated")


asyncio.run(main())
