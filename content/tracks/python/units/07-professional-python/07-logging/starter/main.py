import logging
import sys

LOGGER_NAME = "checkout"

ORDERS = [
    {"id": "A-1", "total": 42.5},
    {"id": "A-2", "total": 980.0},
    {"id": "A-3", "total": 0.0},
]


# 1. setup_logging(level) — configure the "checkout" logger and return it:
#      - logger = logging.getLogger(LOGGER_NAME)
#      - clear logger.handlers (so a second call can't double every line)
#      - a logging.StreamHandler(sys.stdout) whose formatter is
#        logging.Formatter("%(levelname)-8s %(name)s: %(message)s")
#      - logger.setLevel(level), logger.propagate = False


# 2. process_order(order) — get the logger by name (never configure it
#    here), then narrate the work:
#      debug    "validating order %s"
#      error    "order %s rejected: total %.2f is not positive"   -> False
#      warning  "order %s is unusually large: %.2f"    (total > 500)
#      info     "order %s accepted: %.2f"                         -> True
#    Pass the values as arguments after the message — never f-strings.


# 3. main() — setup_logging(logging.INFO), process every order, then
#    log the tally: "%d of %d orders accepted".
#    At INFO the debug lines stay silent:
#
#      INFO     checkout: order A-1 accepted: 42.50
#      WARNING  checkout: order A-2 is unusually large: 980.00
#      INFO     checkout: order A-2 accepted: 980.00
#      ERROR    checkout: order A-3 rejected: total 0.00 is not positive
#      INFO     checkout: 2 of 3 orders accepted


# 4. Call main().
