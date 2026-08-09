import logging
import sys

LOGGER_NAME = "checkout"

ORDERS = [
    {"id": "A-1", "total": 42.5},
    {"id": "A-2", "total": 980.0},
    {"id": "A-3", "total": 0.0},
]


def setup_logging(level):
    """Configure the checkout logger once, at the entry point."""
    logger = logging.getLogger(LOGGER_NAME)
    logger.handlers.clear()
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(levelname)-8s %(name)s: %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(level)
    logger.propagate = False
    return logger


def process_order(order):
    """Accept or reject one order, narrating at the right levels."""
    log = logging.getLogger(LOGGER_NAME)
    log.debug("validating order %s", order["id"])
    if order["total"] <= 0:
        log.error("order %s rejected: total %.2f is not positive", order["id"], order["total"])
        return False
    if order["total"] > 500:
        log.warning("order %s is unusually large: %.2f", order["id"], order["total"])
    log.info("order %s accepted: %.2f", order["id"], order["total"])
    return True


def main():
    """The entry point: configure logging, then do the work."""
    log = setup_logging(logging.INFO)
    accepted = sum(1 for order in ORDERS if process_order(order))
    log.info("%d of %d orders accepted", accepted, len(ORDERS))


main()
