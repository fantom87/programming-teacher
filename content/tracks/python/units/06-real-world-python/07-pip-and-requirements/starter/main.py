from pathlib import Path

# THE BRIEF — "skycast", a TERMINAL weather dashboard that:
#   - fetches forecasts from a web API over HTTP
#   - parses the awkward timestamps the API returns
#   - renders colorful tables right in the terminal
#
# Candidate packages (tested versions):
#   requests 2.32.5          HTTP for humans
#   flask 3.1.2              build web SERVERS
#   rich 14.1.0              colorful terminal output
#   pygame 2.6.1             2D games
#   python-dateutil 2.9.0    parse any timestamp

# 1. Pick the three that fit the brief — pinned "name==version",
#    in the order the brief lists them.
REQUIREMENTS = [
]

# 2. Write requirements.txt: a "# skycast — terminal weather dashboard"
#    comment line, then the three pins, one per line.

# 3. Loop over REQUIREMENTS, split each pin on "==", and print:
#      requests pinned to 2.32.5     (etc.)
#      3 packages pinned
