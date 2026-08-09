import argparse
import csv
import json
from datetime import datetime
from pathlib import Path


def build_parser():
    """The cruncher's interface: which month to report on."""
    parser = argparse.ArgumentParser(description="crunch a month of expenses")
    parser.add_argument("--month", required=True, help="month to report, as YYYY-MM")
    return parser


def load_expenses(path):
    """Read the CSV into a list of typed expense dicts."""
    expenses = []
    with open(path, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            expenses.append({
                "date": datetime.strptime(row["date"], "%Y-%m-%d").date(),
                "category": row["category"],
                "amount": float(row["amount"]),
            })
    return expenses


def crunch(argv):
    """Report on one month of expenses and write summary.json."""
    args = build_parser().parse_args(argv)

    expenses = [e for e in load_expenses("expenses.csv")
                if e["date"].strftime("%Y-%m") == args.month]

    total = round(sum(e["amount"] for e in expenses), 2)
    totals = {}
    for e in expenses:
        totals[e["category"]] = round(totals.get(e["category"], 0) + e["amount"], 2)
    top = max(totals, key=totals.get)

    print(f"== Expense Report: {args.month} ==")
    print(f"{len(expenses)} expenses, {total:.2f} total")
    print("by category:")
    for category in sorted(totals):
        print(f"  {category}: {totals[category]:.2f}")
    print(f"top category: {top}")

    summary = {
        "month": args.month,
        "count": len(expenses),
        "total": total,
        "by_category": totals,
        "top": top,
    }
    Path("summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("summary.json written")


if __name__ == "__main__":
    crunch(["--month", "2026-08"])
