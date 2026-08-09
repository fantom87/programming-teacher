import { readFileSync } from "node:fs";

// Layer 1 — defaults in code: the app must run with zero setup.
const DEFAULTS = {
  MODE: "dev",
  PORT: "3000",
  API_URL: "http://localhost:8080",
};

// KEY=value lines into a plain object — what dotenv and
// node --env-file do under the hood.
function parseEnv(text) {
  const vars = {};
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) continue;
    const eq = line.indexOf("="); // FIRST = only: TOKEN=a=b keeps "a=b"
    vars[line.slice(0, eq)] = line.slice(eq + 1);
  }
  return vars;
}

// The merge IS the policy: later spreads overwrite earlier keys, so
// the real environment always gets the last word.
function resolveConfig(defaults, fileVars, realEnv) {
  return { ...defaults, ...fileVars, ...realEnv };
}

// {} stands where a real app passes process.env — reproducible here,
// overridable by operators in production.
const fileVars = parseEnv(readFileSync(".env", "utf8"));
const config = resolveConfig(DEFAULTS, fileVars, {});

console.log(`mode: ${config.MODE}`);
console.log(`port: ${config.PORT}`);
console.log(`api: ${config.API_URL}`);
