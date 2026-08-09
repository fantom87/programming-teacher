# Builds the Linux AppImage. Development happens on Windows, so this exists to
# produce a Linux artifact without needing a Linux machine — and, just as
# usefully, to prove the app still builds from a clean checkout with nothing
# cached.
#
#   node scripts/build-linux.mjs        (builds, then copies the AppImage out)
#
# Debian bookworm rather than Alpine: the AppImage has to run against glibc,
# which is what every mainstream desktop distro ships.
FROM node:22-bookworm AS build

# Electron's own build tooling shells out to python3; the rest are what
# electron-builder needs to assemble and compress an AppImage.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 ca-certificates xz-utils \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .

# Two installs: the root workspaces (shared/server/web), then app/, which is
# deliberately outside the workspace list so electron and electron-builder
# don't land in every other package's dependency tree.
RUN npm install --no-audit --no-fund \
 && npm install --prefix app --no-audit --no-fund

# Frontend, bundled server, its trimmed dependency closure, and the icons.
RUN npm run app:pack

# electron-builder refuses to write into a root-owned cache it can't create;
# giving it an explicit home avoids that in every CI-ish environment.
ENV ELECTRON_CACHE=/tmp/electron-cache
ENV ELECTRON_BUILDER_CACHE=/tmp/electron-builder-cache
RUN npm run dist:linux --prefix app
