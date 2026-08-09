import asyncio

# 1. fetch(source, ms) — async:
#      await asyncio.sleep(ms / 1000)
#      print(f"{source} arrived")     <- fires in COMPLETION order
#      return f"{source} data"        <- lands in CALL order

# 2. main() — async:
#      print("firing all three")
#      results = await asyncio.gather(
#          fetch("db", 100), fetch("cache", 20), fetch("api", 60))
#      print each result in the list, in order

# 3. asyncio.run(main())
