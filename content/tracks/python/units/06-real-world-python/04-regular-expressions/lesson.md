---
id: 04-regular-expressions
title: Regular Expressions
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Write find_dates (re.findall for every YYYY-MM-DD in a text) and first_error (re.search with a capture group, returning None on no match), then run both over the server log."
docs: [python/strings, python/stdlib-tour]
checks:
  - id: regex-functions-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-log-report
    type: stdout
    entry: main.py
    match: exact
    value: "dates: 2026-08-06, 2026-08-07, 2026-08-08\nfirst error: disk full\n"
  - id: real-patterns
    type: ai-judge
    rubric: "find_dates uses re.findall with a digit-class pattern (\\d{4}-\\d{2}-\\d{2} or an equivalent), and first_error uses re.search with a capture group after 'ERROR: ', returning match.group(1) when found and None otherwise. No .split, slicing, or .find index arithmetic stands in for the regex work, and neither the dates nor 'disk full' are hardcoded."
hints:
  - "A date's shape is r\"\\d{4}-\\d{2}-\\d{2}\" — four digits, dash, two, dash, two. re.findall(pattern, text) returns every match as a list of strings."
  - "first_error wants what comes AFTER the marker: re.search(r\"ERROR: (.+)\", text). The parentheses capture the message; .+ stops at the end of the line."
  - "re.search returns None when nothing matches — check before touching it: match = re.search(...); return match.group(1) if match else None. Then print \", \".join(find_dates(LOG)) and first_error(LOG)."
---
## Describing the shape of text

You've searched text with `in` and `.find()` — fine when you know the
exact words. But how do you find *any date*? You can't list them all.
What you can describe is their **shape**: four digits, a dash, two
digits, a dash, two digits. That's what **regular expressions** do —
they're a mini-language for text shapes, built into Python as `re`:

```python
import re

re.findall(r"\d{4}-\d{2}-\d{2}", text)   # every date in text
```

Reading that pattern piece by piece: `\d` means *any digit*, `{4}`
means *exactly four of the last thing*, and the dashes just mean
themselves. The `r"..."` prefix is a **raw string** — it stops Python
from interpreting the backslashes before `re` gets to see them. All
regex, always raw strings; it's a reflex worth building.

`findall` returns every match as a list. Its sibling `search` finds the
*first* match and answers a richer question — *what exactly matched?* —
using parentheses to **capture** part of the pattern:

```python
match = re.search(r"ERROR: (.+)", line)
if match:
    print(match.group(1))    # just the captured part
```

`.+` is *any character, one or more* — and it won't cross a line break,
so it captures to the end of the line. And there is the trap the docs
warn about in bold: when nothing matches, `search` returns `None`, and
calling `.group(1)` on `None` crashes. Check first, every time.

Regex goes far deeper — `[abc]` classes, `?` optionals, anchors — but
`findall`, `search`, and one capture group already cover a huge share of
real log-mining, scraping, and validation work.

### Your goal

The starter's `LOG` holds three server log lines.

1. Write `find_dates(text)` — every `YYYY-MM-DD` in `text`, in order,
   via `re.findall`.
2. Write `first_error(text)` — the message after the first `"ERROR: "`
   via `re.search` and a capture group; `None` if there's no error.
3. Report on `LOG`:

```
dates: 2026-08-06, 2026-08-07, 2026-08-08
first error: disk full
```
