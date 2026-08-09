---
id: 07-logging
title: Logging
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Retire print from a checkout module: configure the checkout logger with a StreamHandler and a custom Formatter, then narrate process_order at debug, info, warning and error — with lazy %s arguments — and watch INFO hide the debug lines."
docs: [python/stdlib-tour, python/debugging, python/errors-and-exceptions]
checks:
  - id: logger-behaves
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: info-level-run
    type: stdout
    entry: main.py
    match: exact
    value: "INFO     checkout: order A-1 accepted: 42.50\nWARNING  checkout: order A-2 is unusually large: 980.00\nINFO     checkout: order A-2 accepted: 980.00\nERROR    checkout: order A-3 rejected: total 0.00 is not positive\nINFO     checkout: 2 of 3 orders accepted\n"
  - id: real-logging-discipline
    type: ai-judge
    rubric: "setup_logging builds the named logger with logging.getLogger(LOGGER_NAME), clears any existing handlers so a second call cannot double every line, attaches one logging.StreamHandler(sys.stdout) whose formatter is a logging.Formatter with the exact format string '%(levelname)-8s %(name)s: %(message)s', sets the level from its parameter, and sets propagate = False. It is called once, from main — never from process_order. Every log call passes its values as lazy %-style arguments, e.g. log.info(\"order %s accepted: %.2f\", order[\"id\"], order[\"total\"]), never a pre-built f-string or concatenation, so filtered records cost nothing to format. The levels are chosen meaningfully: debug for the per-order validation detail, info for accepted orders and the final tally, warning for the large-order note, error for a rejection. No print calls remain anywhere in the file, and no message text embeds its own level name."
hints:
  - "Four lines make the handler: handler = logging.StreamHandler(sys.stdout), handler.setFormatter(logging.Formatter(\"%(levelname)-8s %(name)s: %(message)s\")), logger.addHandler(handler), logger.setLevel(level). Clear logger.handlers first so a second call doesn't double everything."
  - "Pass values, don't format them: log.warning(\"order %s is unusually large: %.2f\", order[\"id\"], order[\"total\"]). The logger only builds the string if a handler actually emits it — which is the whole point of debug lines you leave in."
  - "process_order reads its logger with logging.getLogger(LOGGER_NAME) — modules ask for a logger, they never configure one. Rejections return False before the accepted line; large orders warn and then carry on."
---
## Print doesn't scale

`print` has one volume: on. You can't turn it down in production, up
while debugging, or send it somewhere other than the console. The
`logging` module gives you all three, and it costs about four lines.

Every message has a **level** — `debug`, `info`, `warning`, `error`,
`critical` — and every logger has a threshold. Set it to `INFO` and the
debug lines vanish without being deleted; drop it to `DEBUG` on a bad
day and they come back.

Code asks for a logger by name and never configures one:

```python
log = logging.getLogger(__name__)     # in every module
log.info("order %s accepted", order_id)
```

Configuration happens once, in the program's entry point, by attaching
a **handler** (where records go) with a **formatter** (what they look
like):

```python
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("%(levelname)-8s %(name)s: %(message)s"))
```

Swap that handler for a `RotatingFileHandler` and everything logs to
disk instead — no code changes. Add `%(asctime)s` and every line gets a
timestamp. Clear the handler list first so calling setup twice doesn't
double every line, and set `propagate = False` so records don't also
climb to the root logger.

Notice the `%s`. Log calls take **lazy arguments**, not f-strings —
`log.debug("row %s", row)` builds the string only if something actually
emits it, so debug lines you leave in cost nothing when they're
filtered. Inside an `except` block, `log.exception("...")` adds the
traceback for free.

### Your goal

1. `setup_logging(level)` — the configuration above, on the `checkout`
   logger, returning it.
2. `process_order(order)` — get the logger by name, then narrate:
   `debug` while validating, `error` and `return False` when the total
   isn't positive, `warning` when it's over 500, `info` when accepted.
   Values go in as `%s` / `%.2f` arguments.
3. `main()` — set up at `INFO`, process every order, then log the
   tally. The debug lines stay silent:

```
INFO     checkout: order A-1 accepted: 42.50
WARNING  checkout: order A-2 is unusually large: 980.00
INFO     checkout: order A-2 accepted: 980.00
ERROR    checkout: order A-3 rejected: total 0.00 is not positive
INFO     checkout: 2 of 3 orders accepted
```
