import statistics


def summarize(readings):
    """Return a one-line summary of a list of sensor readings."""
    average = statistics.fmean(readings)
    return (
        f"{len(readings)} readings, average {average:.2f}, "
        f"range {min(readings):.2f} to {max(readings):.2f}"
    )
