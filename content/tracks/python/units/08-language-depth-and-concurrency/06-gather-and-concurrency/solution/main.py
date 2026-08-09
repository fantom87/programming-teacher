import asyncio


async def fetch(source, ms):
    await asyncio.sleep(ms / 1000)
    print(f"{source} arrived")
    return f"{source} data"


async def main():
    print("firing all three")
    results = await asyncio.gather(
        fetch("db", 100),
        fetch("cache", 20),
        fetch("api", 60),
    )
    for result in results:
        print(result)


asyncio.run(main())
