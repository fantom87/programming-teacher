from storage import load_readings
from stats import average, spread


def main():
    """Load the readings and print the sensor report."""
    readings = load_readings()
    print(f"{len(readings)} readings loaded")
    print(f"average: {average(readings):.1f}")
    print(f"spread: {spread(readings):.1f}")


if __name__ == "__main__":
    main()
