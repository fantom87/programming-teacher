from contextlib import contextmanager

# 1. Section(title) — a class-based context manager:
#      __init__ stores the title
#      __enter__ prints "== title ==" and returns self
#      __exit__(self, exc_type, exc, tb) prints "== end title ==",
#      returns nothing (exceptions keep propagating)

# 2. muted(errors) — a @contextmanager generator:
#      try: yield
#      except errors: print("recovered")

# 3. The demo:
#      with Section("deploy"): print("pushing code")
#      with Section("cleanup"):
#          with muted(ValueError): int("nope")
#          print("still standing")
