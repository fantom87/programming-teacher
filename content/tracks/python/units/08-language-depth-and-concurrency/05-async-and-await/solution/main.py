import asyncio


async def step(name, ms):
    await asyncio.sleep(ms / 1000)
    return f"{name} done"


async def main():
    print("== Build pipeline ==")
    print(await step("restore", 80))
    print(await step("compile", 60))
    print(await step("publish", 40))
    print("build succeeded")


asyncio.run(main())
