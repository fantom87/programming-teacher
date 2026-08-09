from pathlib import Path


def parse_readings(text):
    """Turn raw file text into a list of float readings, skipping blanks."""
    readings = []
    for line in text.splitlines():
        if line.strip():
            readings.append(float(line))
    return readings


def load_readings():
    """Read readings.txt and parse it into floats."""
    return parse_readings(Path("readings.txt").read_text(encoding="utf-8"))
