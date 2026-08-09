from datetime import datetime, timedelta

# 1. parse_day(text) — turn "YYYY-MM-DD" into a date object.
#    (strptime with "%Y-%m-%d", then .date())

# 2. days_between(start, end) — whole days from start to end,
#    both given as "YYYY-MM-DD" strings. Subtract two parsed dates.

# 3. launch = parse_day("2026-08-08"), then print:
#      - the launch in strftime("%A %d %B %Y") form
#      - f"day 100: ..." — launch + timedelta(days=100), as .isoformat()
#      - f"... days until New Year's Eve" — days_between to 2026-12-31
