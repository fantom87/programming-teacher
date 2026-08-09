def dedupe_slow(items):
    seen = []
    result = []
    comparisons = 0
    for item in items:
        found = False
        for old in seen:
            comparisons += 1
            if old == item:
                found = True
                break
        if not found:
            seen.append(item)
            result.append(item)
    return result, comparisons


def dedupe_fast(items):
    seen = set()
    result = []
    comparisons = 0
    for item in items:
        comparisons += 1
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result, comparisons


data = [*range(50)] * 4
slow_result, slow_count = dedupe_slow(data)
fast_result, fast_count = dedupe_fast(data)

print(f"slow: {len(slow_result)} unique in {slow_count} comparisons")
print(f"fast: {len(fast_result)} unique in {fast_count} comparisons")
print(f"same answer: {slow_result == fast_result}")
print(f"speedup: {slow_count // fast_count}x")
