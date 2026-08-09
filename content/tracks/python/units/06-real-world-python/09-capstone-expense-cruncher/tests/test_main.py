def t_parser():
    args = build_parser().parse_args(["--month", "2026-01"])
    assert args.month == "2026-01", "--month should land in args.month"

def t_august_summary():
    import json
    from pathlib import Path
    crunch(["--month", "2026-08"])
    data = json.loads(Path("summary.json").read_text(encoding="utf-8"))
    assert data["month"] == "2026-08", "the summary should record which month was crunched"
    assert data["count"] == 4, f"August has 4 expenses, summary says {data['count']}"
    assert abs(data["total"] - 116.75) < 0.005, f"August's total should be 116.75, got {data['total']}"
    assert data["top"] == "groceries", "August's top category is groceries"
    assert abs(data["by_category"]["eating out"] - 46.40) < 0.005, "eating out should sum to 46.40 in August"

def t_july_summary():
    import json
    from pathlib import Path
    crunch(["--month", "2026-07"])
    data = json.loads(Path("summary.json").read_text(encoding="utf-8"))
    assert data["count"] == 3, f"July has 3 expenses, summary says {data['count']} — is the month filter using the parsed date?"
    assert abs(data["total"] - 105.45) < 0.005, f"July's total should be 105.45, got {data['total']}"
    assert sorted(data["by_category"]) == ["groceries", "transport"], "July has only groceries and transport"
    assert abs(data["by_category"]["groceries"] - 92.95) < 0.005, "July groceries should sum to 92.95"
    assert data["top"] == "groceries", "July's top category is groceries"

def t_dates_are_objects():
    expenses = load_expenses("expenses.csv")
    assert len(expenses) == 7, f"load_expenses should return all 7 rows, got {len(expenses)}"
    first = expenses[0]
    assert hasattr(first["date"], "year"), "date should be a real date object — use strptime(...).date()"
    assert isinstance(first["amount"], float), "amount should be a float, not a string"

test("--month is parsed", t_parser)
test("August crunches correctly", t_august_summary)
test("July crunches correctly (nothing hardcoded)", t_july_summary)
test("loading converts types at the edge", t_dates_are_objects)
