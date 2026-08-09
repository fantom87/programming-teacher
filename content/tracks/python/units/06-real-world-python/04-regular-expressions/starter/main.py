import re

LOG = """2026-08-06 ERROR: disk full
2026-08-07 INFO: backup ok
2026-08-08 ERROR: timeout"""

# 1. find_dates(text) — every YYYY-MM-DD in text, in order.
#    (re.findall with a \d pattern — raw string!)

# 2. first_error(text) — the message after the first "ERROR: ",
#    using re.search and a capture group. Return None if no match.

# 3. Print the report:
#      dates: 2026-08-06, 2026-08-07, 2026-08-08
#      first error: disk full
