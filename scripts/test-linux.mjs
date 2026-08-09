// Runs the built AppImage in a clean Debian container and proves it works:
// server up, curriculum loaded, app page served, a real lesson completed, and
// nothing written outside the app's own folder.
//
//   node scripts/test-linux.mjs        (after node scripts/build-linux.mjs)
//
// The container has no Node, no Python and no toolchain — only Electron's
// runtime libraries and a virtual display. The AppImage is copied in rather
// than bind-mounted, so no host path is involved.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE = "programming-teacher-linux-test";
const CONTAINER = "programming-teacher-linux-run";
const DIST = path.join(ROOT, "app", "dist");

const appImage = fs.existsSync(DIST) ? fs.readdirSync(DIST).find((f) => f.endsWith(".AppImage")) : null;
if (!appImage) {
  console.error("[test] no .AppImage in app/dist — run `npm run app:dist:linux` first.");
  process.exit(1);
}

const run = (args, opts = {}) => execFileSync("docker", args, { cwd: ROOT, stdio: "inherit", ...opts });
const capture = (args) => execFileSync("docker", args, { cwd: ROOT, encoding: "utf8" });

// Piped on stdin, not "-f <file> .": the test image needs no build context,
// and sending one would ship the whole repo into it.
console.log(`[test] building ${IMAGE}`);
run(["build", "-t", IMAGE, "-"], {
  input: fs.readFileSync(path.join(ROOT, "scripts", "linux-test.Dockerfile")),
  stdio: ["pipe", "inherit", "inherit"],
});

spawnSync("docker", ["rm", "-f", CONTAINER], { stdio: "ignore" });
// seccomp=unconfined lets Chromium's own sandbox start, so this exercises the
// same code path a real desktop does instead of --no-sandbox papering over it.
run(["run", "-d", "--name", CONTAINER, "--security-opt", "seccomp=unconfined", IMAGE, "sleep", "infinity"]);

try {
  run(["cp", path.join(DIST, appImage), `${CONTAINER}:/home/learner/${appImage}`]);
  // docker cp writes as root even into a non-root container's home, so hand
  // the file over before dropping back to the unprivileged user.
  run(["exec", "-u", "root", CONTAINER, "chown", "learner:learner", `/home/learner/${appImage}`]);
  run(["exec", "-u", "root", CONTAINER, "chmod", "+x", `/home/learner/${appImage}`]);

  const script = String.raw`
set -u
cd /home/learner
echo "--- environment ---"
echo "node on PATH:   $(command -v node || echo 'NO (good)')"
echo "python on PATH: $(command -v python3 || echo 'NO (good)')"

# --appimage-extract-and-run avoids needing FUSE (and a privileged container);
# it unpacks to a temp dir and launches exactly the same binary.
export APPIMAGE_EXTRACT_AND_RUN=1
xvfb-run -a ./__APPIMAGE__ > app.log 2>&1 &
APP_PID=$!

for i in $(seq 1 120); do
  if curl -sf http://127.0.0.1:4517/api/health > health.json 2>/dev/null; then break; fi
  sleep 1
done
if [ ! -s health.json ]; then
  echo "FAILED: no health response in 120s"; echo "--- app log ---"; cat app.log; exit 1
fi
echo "ready after $i seconds"
echo "--- health ---"; cat health.json; echo
echo "--- curriculum ---"
curl -s http://127.0.0.1:4517/api/curriculum \
  | tr ',' '\n' | grep -c '"id"' | sed 's/^/curriculum entries: /'
echo "--- app page ---"
curl -s -o /dev/null -w 'status=%{http_code} type=%{content_type}\n' http://127.0.0.1:4517/
echo "--- complete a real lesson (SQL, runs in-process) ---"
curl -s -X POST http://127.0.0.1:4517/api/check \
  -H 'Content-Type: application/json' --data-binary @payload.json
echo
echo "--- where did progress actually land? ---"
# It must be somewhere that outlives the process. An AppImage's own directory
# is a temporary mount, so anything written there is gone at exit.
find / -name progress.json -not -path '*/node_modules/*' 2>/dev/null | while read -r f; do
  case "$f" in
    /tmp/*|/proc/*) echo "TEMPORARY (lost on exit): $f" ;;
    *) echo "persistent: $f" ;;
  esac
done
echo "HOME: $(ls -A /home/learner | tr '\n' ' ')"
kill $APP_PID 2>/dev/null
exit 0
`.replace(/__APPIMAGE__/g, appImage);

  // The lesson payload is built here, from the repo, so the container needs no
  // checkout of its own.
  const solution = path.join(
    ROOT, "content", "tracks", "sql", "units", "01-first-queries", "01-what-a-table-is", "solution",
  );
  const files = Object.fromEntries(
    fs.readdirSync(solution).map((f) => [f, fs.readFileSync(path.join(solution, f), "utf8")]),
  );
  const payload = path.join(ROOT, "app", "dist", ".lesson-payload.json");
  fs.writeFileSync(payload, JSON.stringify({ lessonId: "sql/01-first-queries/01-what-a-table-is", files }));
  run(["cp", payload, `${CONTAINER}:/home/learner/payload.json`]);
  fs.rmSync(payload, { force: true });

  const out = capture(["exec", CONTAINER, "bash", "-lc", script]);
  console.log(out);
  const ok = /"completed":true/.test(out);
  console.log(ok ? "[test] PASS — lesson completed inside the container." : "[test] FAIL — lesson did not complete.");
  process.exitCode = ok ? 0 : 1;
} finally {
  spawnSync("docker", ["rm", "-f", CONTAINER], { stdio: "ignore" });
}
