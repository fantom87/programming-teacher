# The interface layer — deliberately boring.
#
# 1. Import load_readings from storage, average and spread from stats.
#
# 2. def main(): load the readings, then print:
#      4 readings loaded
#      average: 21.5        (:.1f formatting)
#      spread: 4.5
#
# 3. Call main() under if __name__ == "__main__":
