import threading

# 1. Shared state, module level:
#      results = []
#      lock = threading.Lock()

# 2. worker(name, items):
#      total = sum(items)
#      with lock: results.append((name, total))

# 3. Three threads — threading.Thread(target=worker, args=(name, items)):
#      "alpha" [1, 2, 3]   "beta" [10, 20]   "gamma" [5, 5, 5]
#    Start ALL of them, then join ALL of them (two loops).

# 4. After the joins:
#      for name, total in sorted(results): print(f"{name}: {total}")
#      print(f"workers: {len(results)}")
