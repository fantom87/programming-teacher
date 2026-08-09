# The dev container

This folder exists for one reason: a reviewer should be able to click
**Code → Codespaces → Create** and end up looking at the running app, having
typed nothing. `devcontainer.json` builds a Node 22 image, adds Python 3.12,
.NET 8 and Go, runs `npm install` once (`postCreateCommand`), then starts the
dev server in the background on every attach (`postAttachCommand` →
`start-dev.sh`). Port 5173 is forwarded with `onAutoForward: "openBrowser"` so
Codespaces pops the tab itself; 4517 is forwarded `silent` because the API is
only ever meant to be reached through Vite's `/api` proxy.

`start-dev.sh` runs on *every* attach, so it is idempotent — it curls
`localhost:5173` first and does nothing if the app is already up. It also
re-runs `scripts/copy-pyodide.mjs` if `web/public/pyodide` is missing; that
directory is gitignored and normally arrives via `web`'s `postinstall` during
`npm install` (verified: npm 11 does run workspace `postinstall` scripts from a
root install). Output goes to `/tmp/pt-dev.log`, and `restart` / `stop`
subcommands are there for when a reviewer changes something and wants the
server back. The script is invoked as `bash .devcontainer/start-dev.sh` rather
than `./start-dev.sh` because a repo authored on Windows carries no executable
bit.

`npm install` on Linux from a lockfile generated on Windows is the usual place
this sort of thing falls over. It doesn't here: `package-lock.json` carries the
`linux-x64-gnu` (and musl, and arm64) variants of every native optional
dependency — `@rolldown/binding`, `@esbuild`, `lightningcss`,
`@typescript/typescript`, `@anthropic-ai/claude-agent-sdk`.

## The Host-header question

The API server (`server/src/index.ts`) rejects any request whose `Host` header
isn't localhost, and that guard stays fully intact in the container. It does
not need an escape hatch. The browser never talks to 4517; it talks to Vite on
5173, and Vite's proxy sets `changeOrigin: true`, which rewrites the outbound
`Host` to `localhost:4517` before the request reaches Express. Vite's string
shorthand (`"/api": "http://localhost:4517"`) already defaulted that to true,
but `web/vite.config.ts` now states it explicitly so a future Vite upgrade
can't silently 403 every API call.

Vite's *own* host check is the part that breaks. Since Vite 6 the dev server
403s ("Blocked request") on any Host outside localhost, and behind the
Codespaces proxy every request arrives as `<codespace>-5173.app.github.dev`.
That is what `PT_ALLOW_REMOTE_HOST=1` fixes, and nothing else: set only in this
file's `containerEnv`, read only by `web/vite.config.ts`, it adds
`.app.github.dev` (plus `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN` for GitHub
Enterprise) to `server.allowedHosts` and binds Vite to all interfaces inside
the container. **Never set it on a personal machine.** The tradeoff is only
acceptable here because the container is disposable, belongs to one reviewer,
and sits behind GitHub's authenticated port-forwarding proxy — whereas on a
real machine `/api/run` executes arbitrary code and the localhost-only posture
is the whole defence. Nothing about the default path changes: with the variable
unset, Vite binds localhost and accepts localhost Hosts, exactly as before.

Both halves of that were checked against a real Vite 8 dev server, not reasoned
about: with the variable unset, a request carrying
`Host: pt-abc123-5173.app.github.dev` gets Vite's 403 "Blocked request"; with it
set, the same request is served, and the proxied `/api` hop arrives at 4517 as
`Host: localhost:4517`, which `ALLOWED_HOST` accepts. What could not be checked
from a Windows workstation is the container itself — see the caveats at the end
of the "Take a look in your browser" section in the root README.

## Deliberate omissions

**Rust.** `rustup` would add roughly a gigabyte and several minutes to first
boot, and the Rust track currently has zero lessons — only the playground's
Rust tab and a Rust-flavoured custom lesson would use it. Add
`"ghcr.io/devcontainers/features/rust:1": {}` to `features` if you need it.

**VS Code extensions.** The list is empty on purpose. The deliverable is a web
app in a browser tab, the repo has no ESLint or Prettier config to power an
extension, and every extension costs first-boot seconds. Add your own to
`customizations.vscode.extensions`.

**Machine size.** No `hostRequirements`, so Codespaces uses the smallest
machine the account allows (usually 2-core / 8 GB), which works but makes the
first `npm install` and the first `dotnet run` slow. Adding
`"hostRequirements": { "cpus": 4 }` is a real improvement — at the cost of
failing outright for anyone whose org only offers 2-core machines.

The single biggest speedup available is a
[Codespaces prebuild](https://docs.github.com/en/codespaces/prebuilding-your-codespaces)
on this repo: it bakes the image, the features and `node_modules` ahead of
time and turns a several-minute first boot into a few seconds.

## Editing this config

`devcontainer.json` is written as strict JSON — no comments — even though the
devcontainer spec permits JSONC, so that any parser (including `JSON.parse`,
`jq`, and CI linters) can read it. Keep it that way and put the reasoning here
instead. After changing `devcontainer.json`, an existing codespace needs
**Codespaces: Rebuild Container**; `containerEnv` in particular is baked in at
container creation.
