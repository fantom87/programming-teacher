def t_worker_appends_under_lock():
    before = len(results)
    worker("probe", [2, 2, 3])
    assert ("probe", 7) in results, "worker should append a (name, total) tuple"
    assert len(results) == before + 1, "one call, one appended entry"

def t_lock_is_real():
    assert hasattr(lock, "acquire") and hasattr(lock, "release"), "lock should be a threading.Lock()"
    acquired = lock.acquire(blocking=False)
    assert acquired, "the lock must be released after worker finishes — use `with lock:`"
    lock.release()

def t_many_threads_all_land():
    import threading as th
    start = len(results)
    threads = [th.Thread(target=worker, args=(f"w{i}", [i, i])) for i in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert len(results) == start + 8, f"8 joined threads should mean 8 new entries, got {len(results) - start}"
    assert ("w5", 10) in results, "each worker's own sum should land intact"

def t_original_report_present():
    assert ("alpha", 6) in results and ("beta", 30) in results and ("gamma", 15) in results, "the three demo workers should have run at import time"

test("worker computes and appends one entry", t_worker_appends_under_lock)
test("the lock is a Lock and gets released", t_lock_is_real)
test("start-all then join-all lands every result", t_many_threads_all_land)
test("the demo trio ran", t_original_report_present)
