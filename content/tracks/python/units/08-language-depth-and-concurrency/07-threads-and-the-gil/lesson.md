---
id: 07-threads-and-the-gil
title: Threads and the GIL
language: python
runner: local
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Run three worker threads that append results to a shared list under a Lock, join() them all, then print a deterministic sorted report — and know from the GIL why threads buy you I/O time, not CPU time."
docs: [python/stdlib-tour, python/functions]
checks:
  - id: threads-behave
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-report
    type: stdout
    entry: main.py
    match: exact
    value: "alpha: 6\nbeta: 30\ngamma: 15\nworkers: 3\n"
  - id: disciplined-threading
    type: ai-judge
    rubric: "worker(name, items) computes the sum locally, then appends the (name, total) tuple inside a `with lock:` block — the lock is a module-level threading.Lock and the append is the only code under it. The three threads are created with threading.Thread(target=worker, args=(...)) — worker is passed as a reference, never called with parentheses in the Thread constructor. ALL threads are started in one loop before ANY is joined in a second loop (start/join interleaved per thread would serialize them). Printing happens only after every join, iterates sorted(results), and computes both the per-worker lines and the workers count from the results list — no literals, no time.sleep-based synchronization anywhere."
hints:
  - "worker(name, items): total = sum(items), then with lock: results.append((name, total)) — compute outside the lock, share inside it."
  - "Build the trio first: threads = [threading.Thread(target=worker, args=(\"alpha\", [1, 2, 3])), ...] — note target=worker without parentheses; args carries the arguments."
  - "Two separate loops: for t in threads: t.start() then for t in threads: t.join(). After the joins, results is complete — sort it for a deterministic report and print len(results) as the worker count."
---
## Real threads, one interpreter

`threading.Thread` gives you genuine OS threads — preemptive,
scheduled by the operating system, all sharing your program's memory.
Then CPython adds its famous asterisk: the **Global Interpreter
Lock**. Only one thread may execute Python bytecode at a time. Two
threads crunching numbers take turns on one core — pure-CPU work gets
*zero* speedup, sometimes a slowdown from the switching.

So why does every serious Python service still use threads? Because
the GIL is *released while a thread waits* — on a socket, a file, a
database, `time.sleep`. Ten threads waiting on ten slow APIs really do
wait simultaneously. The rule of thumb, worth memorizing:

- **I/O-bound** → threads (or last lesson's asyncio).
- **CPU-bound** → `multiprocessing` / `concurrent.futures.
  ProcessPoolExecutor`: separate *processes*, each with its own
  interpreter and GIL, truly parallel — at the cost of copying data
  between them.

Shared memory is the thread superpower and the thread trap. `results.
append(...)` from three threads at once is a race waiting to happen,
so every touch of shared state goes under a **`Lock`**:

```python
lock = threading.Lock()

with lock:                      # __enter__ acquires, __exit__ releases
    results.append((name, total))
```

Lesson 2's context-manager protocol, doing real synchronization work.

And the discipline that makes threaded programs *deterministic*:
**start everything, then `join()` everything.** `t.join()` blocks
until thread `t` finishes — after joining all threads you *know* every
result has landed, no sleeps, no guessing. Order of arrival inside
`results` is still anyone's race — so sort before you print.

### Your goal

1. Module level: an empty `results` list and a `threading.Lock()`.
2. `worker(name, items)` — sum the items, append `(name, total)`
   under the lock.
3. Three threads via `threading.Thread(target=..., args=...)`:
   `alpha` with `[1, 2, 3]`, `beta` with `[10, 20]`, `gamma` with
   `[5, 5, 5]`. Start all three, then join all three.
4. Print each entry of `sorted(results)` as `name: total`, then the
   count line:

```
alpha: 6
beta: 30
gamma: 15
workers: 3
```
