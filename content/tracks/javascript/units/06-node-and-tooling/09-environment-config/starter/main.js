import { readFileSync } from "node:fs";

// Layer 1 — defaults in code: the app must run with zero setup.
const DEFAULTS = {
  MODE: "dev",
  PORT: "3000",
  API_URL: "http://localhost:8080",
};

// 1. parseEnv(text) — KEY=value lines into a plain object:
//    trim each line; skip blanks and # comments; split on the FIRST
//    "=" only (indexOf + slice), so TOKEN=a=b keeps "a=b".

// 2. resolveConfig(defaults, fileVars, realEnv) — merge so that
//    realEnv beats fileVars beats defaults. Spread order is the rule.

// 3. Read the .env beside this file, resolve with {} standing in for
//    process.env (keeps the run reproducible), and print from the
//    RESOLVED config:
//      mode: <MODE>
//      port: <PORT>
//      api: <API_URL>
