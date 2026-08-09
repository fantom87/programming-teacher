# The storage layer — all file access lives here, and only here.
#
# 1. parse_readings(text) — split into lines, skip blanks, float()
#    each reading into a list. Pure: any string in, floats out.
#
# 2. load_readings() — read readings.txt (pathlib, encoding="utf-8")
#    and return parse_readings of its text.
#
# One-line docstrings on both.
