# 1. dedupe_slow(items) -> (unique_items, comparisons)
#      seen = []  — for each item, scan seen with an inner loop:
#      comparisons += 1 per equality check, break on match.
#      No match -> append to seen and to the result list.

# 2. dedupe_fast(items) -> (unique_items, comparisons)
#      seen = set()  — one counted check per item, add on miss.

# 3. The measured report, on data = [*range(50)] * 4:
#      slow: {count} unique in {comparisons} comparisons
#      fast: {count} unique in {comparisons} comparisons
#      same answer: {slow_result == fast_result}
#      speedup: {slow_comparisons // fast_comparisons}x
