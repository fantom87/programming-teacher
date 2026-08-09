def t_same_answers():
    items = ["b", "a", "b", "c", "a"]
    slow, _ = dedupe_slow(items)
    fast, _ = dedupe_fast(items)
    assert slow == ["b", "a", "c"], f"dedupe_slow should keep first-seen order, got {slow}"
    assert fast == ["b", "a", "c"], f"dedupe_fast should keep first-seen order, got {fast}"

def t_honest_scan_count():
    _, comparisons = dedupe_slow(["b", "a", "b", "c", "a"])
    assert comparisons == 6, f"expected 6 comparisons (0+1+1+2+2 — scan until hit, count every check), got {comparisons}"

def t_flat_set_count():
    _, comparisons = dedupe_fast(["b", "a", "b", "c", "a"])
    assert comparisons == 5, f"the set version pays exactly one check per item — expected 5, got {comparisons}"

def t_quadratic_vs_linear():
    assert dedupe_slow([*range(10)] * 2)[1] == 100, "list scanning on n=10 doubled should cost n^2 = 100"
    assert dedupe_slow([*range(20)] * 2)[1] == 400, "double the uniques -> 4x the comparisons: that's O(n^2)"
    assert dedupe_fast([*range(10)] * 2)[1] == 20, "the set version should cost one check per item: 20"
    assert dedupe_fast([*range(20)] * 2)[1] == 40, "double the data -> double the checks: that's O(n)"

def t_empty_feed():
    assert dedupe_slow([]) == ([], 0), "no items, no comparisons"
    assert dedupe_fast([]) == ([], 0), "no items, no comparisons"

test("both versions agree on the answer", t_same_answers)
test("the scan counter is honest", t_honest_scan_count)
test("the set counter is one per item", t_flat_set_count)
test("quadratic vs linear, measured", t_quadratic_vs_linear)
test("empty input costs nothing", t_empty_feed)
