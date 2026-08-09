---
id: 03-dates-and-times
title: Dates and Times
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Write parse_day (strptime an ISO string into a date) and days_between (date subtraction), then use them plus timedelta to report on the 2026-08-08 launch date."
docs: [python/stdlib-tour, python/strings]
checks:
  - id: date-functions-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-launch-report
    type: stdout
    entry: main.py
    match: exact
    value: "Saturday 08 August 2026\nday 100: 2026-11-16\n145 days until New Year's Eve\n"
  - id: real-date-arithmetic
    type: ai-judge
    rubric: "parse_day uses datetime.strptime with the %Y-%m-%d format (plus .date()), days_between subtracts two parsed dates and returns the timedelta's .days, day 100 is computed by adding timedelta(days=100) to the launch date, and the 145 comes from calling days_between — no date string in the output is typed by hand and no day counts are hardcoded."
hints:
  - "datetime.strptime(\"2026-08-08\", \"%Y-%m-%d\") reads the string — %Y year, %m month, %d day. Tack on .date() to drop the midnight time part."
  - "Subtracting two dates gives a timedelta: (parse_day(end) - parse_day(start)).days is the whole-day count. Addition works too: launch + timedelta(days=100)."
  - "The three prints: launch.strftime(\"%A %d %B %Y\"), then f\"day 100: {(launch + timedelta(days=100)).isoformat()}\", then f\"{days_between('2026-08-08', '2026-12-31')} days until New Year's Eve\"."
---
## Dates are not strings

`"2026-08-08"` looks like a date, but to Python it's just eleven
characters. Ask it what weekday that is, or what's 100 days later, and
a string has no answer. The `datetime` module turns text into **date
objects** that can actually do calendar math:

```python
from datetime import datetime, timedelta

launch = datetime.strptime("2026-08-08", "%Y-%m-%d").date()
```

`strptime` — *string parse time* — needs two things: the text and a
**format recipe**. `%Y` is the 4-digit year, `%m` the month, `%d` the
day. The `.date()` on the end drops the time-of-day part we don't need.
Once parsed, arithmetic just works:

```python
launch + timedelta(days=100)     # a date 100 days later
later - earlier                  # a timedelta; .days is the count
```

That subtraction quietly handles month lengths and leap years — the
stuff that makes hand-counting days a bug farm. Going back to text is
`strftime` (*string format time*), the same recipes in reverse, plus
friendly ones like `%A` (weekday name) and `%B` (month name):

```python
launch.strftime("%A %d %B %Y")   # "Saturday 08 August 2026"
launch.isoformat()               # "2026-08-08"
```

So every date task is the same three-step pipeline: **parse** the text
into an object, **compute** with objects, **format** back to text at
the last moment. Programs that pass dates around as strings end up
reimplementing the calendar badly — you've now seen the whole cure.

(One rule for this lesson: no `datetime.now()`. Your output must be the
same on every run — the checker insists.)

### Your goal

1. Write `parse_day(text)` — turns `"YYYY-MM-DD"` into a `date` object
   with `strptime`.
2. Write `days_between(start, end)` — both ISO strings; return the
   whole days from start to end (negative if end is earlier).
3. Using `launch = parse_day("2026-08-08")`, print the launch weekday,
   the date 100 days in, and the days until `2026-12-31`:

```
Saturday 08 August 2026
day 100: 2026-11-16
145 days until New Year's Eve
```
