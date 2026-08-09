# A clean Linux desktop, minus the desktop: Debian with Electron's runtime
# libraries and a virtual display, and deliberately NO Node, no Python, no
# toolchain. If the AppImage works here it works on a machine where nothing
# has ever been installed — which is the whole claim.
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 libatspi2.0-0 \
      libdrm2 libgbm1 libasound2 libxcb-dri3-0 libcups2 libpango-1.0-0 \
      xvfb xauth ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

# Chromium's sandbox will not run as root. A normal unprivileged user is also
# what an actual Linux user is, so the test matches reality instead of working
# around it.
RUN useradd -m -s /bin/bash learner
USER learner
WORKDIR /home/learner
