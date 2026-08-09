import argparse
import csv
import json
from datetime import datetime
from pathlib import Path

# The Expense Cruncher — build it part by part.

# Part 1: build_parser() — ArgumentParser with one required option:
#         --month (a "YYYY-MM" string, required=True).

# Part 2: load_expenses(path) — csv.DictReader over the file, returning
#         a list of dicts with REAL types:
#           {"date": <date>, "category": str, "amount": float}

# Part 3: crunch(argv) — parse argv, keep expenses where the date's
#         strftime("%Y-%m") equals args.month, then print the report:
#         header, count + rounded total, per-category totals
#         (alphabetical, :.2f), top category (max by total).

# Part 4: still in crunch — build the summary dict:
#           {"month", "count", "total", "by_category", "top"}
#         write it to summary.json with json.dumps(..., indent=2),
#         then print: summary.json written

# Finally, uncomment the guarded call:
# if __name__ == "__main__":
#     crunch(["--month", "2026-08"])
