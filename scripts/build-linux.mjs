// Builds the Linux AppImage in a container and copies it into app/dist.
//
//   node scripts/build-linux.mjs
//
// The build happens entirely inside the image (see scripts/linux.Dockerfile).
// Nothing is bind-mounted on purpose: npm install inside a Linux container
// writing into the host's node_modules would replace the Windows platform
// binaries and break the next Windows build.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE = "programming-teacher-linux";
const CONTAINER = "programming-teacher-linux-extract";
const OUT = path.join(ROOT, "app", "dist");

const docker = (args, opts = {}) =>
  execFileSync("docker", args, { cwd: ROOT, stdio: "inherit", ...opts });

if (spawnSync("docker", ["version"], { stdio: "ignore" }).status !== 0) {
  console.error("[linux] docker isn't available — start Docker Desktop (or install docker) and retry.");
  process.exit(1);
}

console.log(`[linux] building ${IMAGE} (first run pulls node:22-bookworm and Electron — several minutes)`);
docker(["build", "-f", "scripts/linux.Dockerfile", "-t", IMAGE, "."]);

// A stopped container is just a handle on the image's filesystem; docker cp
// reads straight out of it without ever starting anything.
spawnSync("docker", ["rm", "-f", CONTAINER], { stdio: "ignore" });
docker(["create", "--name", CONTAINER, IMAGE]);
try {
  const listing = execFileSync(
    "docker",
    ["run", "--rm", "--entrypoint", "sh", IMAGE, "-c", "ls /src/app/dist/*.AppImage"],
    { encoding: "utf8" },
  ).trim();
  const produced = listing.split("\n").filter(Boolean);
  if (produced.length === 0) throw new Error("the build produced no .AppImage");

  fs.mkdirSync(OUT, { recursive: true });
  for (const remote of produced) {
    const name = path.posix.basename(remote);
    docker(["cp", `${CONTAINER}:${remote}`, path.join(OUT, name)]);
    const mb = (fs.statSync(path.join(OUT, name)).size / 1024 ** 2).toFixed(1);
    console.log(`[linux] wrote ${path.join(OUT, name)} (${mb} MB)`);
  }
} finally {
  spawnSync("docker", ["rm", "-f", CONTAINER], { stdio: "ignore" });
}
