from datetime import datetime, timedelta


def parse_day(text):
    """Turn a 'YYYY-MM-DD' string into a date object."""
    return datetime.strptime(text, "%Y-%m-%d").date()


def days_between(start, end):
    """Whole days from start to end (negative if end is earlier)."""
    return (parse_day(end) - parse_day(start)).days


launch = parse_day("2026-08-08")

print(launch.strftime("%A %d %B %Y"))
print(f"day 100: {(launch + timedelta(days=100)).isoformat()}")
print(f"{days_between('2026-08-08', '2026-12-31')} days until New Year's Eve")
