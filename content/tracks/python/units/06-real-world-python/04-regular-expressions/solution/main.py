import re

LOG = """2026-08-06 ERROR: disk full
2026-08-07 INFO: backup ok
2026-08-08 ERROR: timeout"""


def find_dates(text):
    """Every YYYY-MM-DD date in the text, in order."""
    return re.findall(r"\d{4}-\d{2}-\d{2}", text)


def first_error(text):
    """The message after the first 'ERROR: ', or None."""
    match = re.search(r"ERROR: (.+)", text)
    if match:
        return match.group(1)
    return None


print("dates:", ", ".join(find_dates(LOG)))
print("first error:", first_error(LOG))
