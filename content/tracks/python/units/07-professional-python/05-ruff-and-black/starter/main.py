from pathlib import Path

MAX_LINE = 88  # black's default, and ruff's


# 1. check_source(filename, source) -> list of finding strings.
#    Walk the lines with enumerate(source.splitlines(), start=1) and
#    append one string per problem, shaped exactly like ruff's:
#
#      f"{filename}:{number}: E501 line too long ({len(line)} > {MAX_LINE})"
#      f"{filename}:{number}: W291 trailing whitespace"
#      f"{filename}:{number}: F401 '{name}' imported but unused"
#
#    E501  len(line) > MAX_LINE
#    W291  line != line.rstrip()
#    F401  the line (stripped) starts with "import " -> the name is what
#          follows; or starts with "from " and contains " import " -> the
#          name is what follows " import ". It's unused when that name
#          appears on no OTHER line of the file.
#
#    Return the findings. Don't print them here.


# 2. main() — read messy.py, run check_source over it, print every
#    finding on its own line, then:
#      Found 3 error(s).        (when there are findings)
#      All checks passed!       (when there are none)


# 3. Call main(), then go clean messy.py until it prints:
#      All checks passed!
#    summarize must keep returning exactly the same string.
