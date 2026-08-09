import threading

results = []
lock = threading.Lock()


def worker(name, items):
    total = sum(items)
    with lock:
        results.append((name, total))


threads = [
    threading.Thread(target=worker, args=("alpha", [1, 2, 3])),
    threading.Thread(target=worker, args=("beta", [10, 20])),
    threading.Thread(target=worker, args=("gamma", [5, 5, 5])),
]
for t in threads:
    t.start()
for t in threads:
    t.join()

for name, total in sorted(results):
    print(f"{name}: {total}")
print(f"workers: {len(results)}")
