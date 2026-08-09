#!/usr/bin/env bash
# Launched by devcontainer.json's postAttachCommand, which runs every time
# someone attaches to this container — not just the first time. So this has to
# be idempotent: reattaching after a disconnect must not start a second copy.
# (The API server calls process.exit(1) on EADDRINUSE, and a second Vite would
# quietly move to port 5174, which nothing forwards.)
#
#   bash .devcontainer/start-dev.sh            start if not already running
#   bash .devcontainer/start-dev.sh restart    stop, then start
#   bash .devcontainer/start-dev.sh stop       stop
set -u

cd "$(dirname "${BASH_SOURCE[0]}")/.."

LOG=/tmp/pt-dev.log
URL=http://localhost:5173/
ACTION="${1:-start}"

up() { curl -sfo /dev/null --max-time 2 "$URL"; }

stop() {
  # `npm run dev` fans out into concurrently -> tsx (API, 4517) + vite (web,
  # 5173). Killing only the parent strands the children still holding the
  # ports, so name all four. Safe to be this blunt: nothing else in this
  # container runs them.
  for pattern in "npm run dev" concurrently "src/index.ts" vite; do
    pkill -f "$pattern" 2>/dev/null || true
  done
  for _ in $(seq 1 15); do
    up || return 0
    sleep 1
  done
}

start() {
  # web/public/pyodide and the sql.js .wasm files are gitignored; web's
  # postinstall copies them out of node_modules during `npm install`. Belt and
  # braces — if that did not happen, in-browser Python and SQL would fail at
  # the moment a lesson tried to use them, which is a rotten way to find out.
  if [ ! -d web/public/pyodide ]; then
    echo "Copying browser runtimes (pyodide, sql.js) ..."
    node scripts/copy-pyodide.mjs || true
  fi

  echo "Starting Rubberduck (log: $LOG) ..."
  # setsid detaches from the attach session's process group so the dev server
  # outlives this command; nohup alone is the fallback if setsid is missing.
  if command -v setsid >/dev/null 2>&1; then
    setsid nohup npm run dev >"$LOG" 2>&1 </dev/null &
  else
    nohup npm run dev >"$LOG" 2>&1 </dev/null &
  fi

  for _ in $(seq 1 90); do
    up && return 0
    sleep 1
  done
}

case "$ACTION" in
  stop)
    stop
    echo "Rubberduck stopped."
    exit 0
    ;;
  restart)
    stop
    start
    ;;
  *)
    if up; then
      echo "Rubberduck is already running."
    else
      start
    fi
    ;;
esac

if up; then
  cat <<'BANNER'

------------------------------------------------------------------
  Rubberduck is running.

  Open port 5173 ("Rubberduck") — Codespaces should have
  opened a browser tab already; otherwise use the Ports panel.

  Log      tail -f /tmp/pt-dev.log
  Restart  bash .devcontainer/start-dev.sh restart

  250 of the 357 lessons run entirely in your browser and need
  nothing further. The AI tutor needs your own Claude login — see
  "Take a look in your browser" in README.md.
------------------------------------------------------------------

BANNER
else
  echo "Rubberduck did not answer on $URL within 90s."
  echo "Look at $LOG (tail -50 $LOG) — the dev server may still be starting."
fi
