// electron-builder refuses to copy a directory named `node_modules` through
// `extraResources` — it skips them during the walk, silently, so the app packs
// fine and then dies at runtime on `require("sql.js")`. Three packages CANNOT
// be bundled into server.cjs (they read files off their own package dir), so
// they must land on disk next to it. That copy happens here instead, after the
// app is packed and before the portable/nsis target archives it.
//
// Source: build/server-dist (npm run bundle:server && node scripts/stage-server-deps.mjs)
// Dest:   <appOutDir>/resources/server   →  resources/server/server.cjs
//                                          resources/server/node_modules/…
const fs = require("node:fs");
const path = require("node:path");

exports.default = async function afterPack(context) {
  const repo = path.join(__dirname, "..");
  const src = path.join(repo, "build", "server-dist");
  const dest = path.join(context.appOutDir, "resources", "server");

  if (!fs.existsSync(path.join(src, "server.cjs"))) {
    throw new Error(
      `[afterPack] no bundled server at ${src}.\n` +
        "Run: npm run bundle:server && node scripts/stage-server-deps.mjs (or just npm run app:pack)",
    );
  }
  const modules = path.join(src, "node_modules");
  if (!fs.existsSync(modules)) {
    throw new Error(`[afterPack] no staged dependencies at ${modules} — run node scripts/stage-server-deps.mjs`);
  }

  // Full replace: win-unpacked survives between builds, and a leftover copy of
  // a package that is no longer in the closure would ship forever.
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, dereference: true });

  const count = fs.readdirSync(path.join(dest, "node_modules")).length;
  console.log(`  • copied bundled server + ${count} dependency entr(ies) to resources/server`);
};
