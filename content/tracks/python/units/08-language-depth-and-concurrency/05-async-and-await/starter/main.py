import asyncio

# 1. step(name, ms) — a coroutine:
#      async def, await asyncio.sleep(ms / 1000), return f"{name} done"

# 2. main() — also async def:
#      print "== Build pipeline =="
#      print the awaited results of step("restore", 80),
#      step("compile", 60), step("publish", 40) — in order
#      print "build succeeded"

# 3. One driver at the bottom:
#      asyncio.run(main())
