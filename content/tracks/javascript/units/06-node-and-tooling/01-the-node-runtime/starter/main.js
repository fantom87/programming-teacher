// The Node runtime — three small steps.

// 1. detectRuntime() — return "node" or "browser".
//    Decide with typeof checks on globals (window, process).
//    typeof never throws, even on names that don't exist.

// 2. describeArgs(args) — takes a PLAIN ARRAY (never process itself).
//    []                  -> "args: none"
//    ["deploy", "--fast"] -> "args (2): deploy, --fast"

// 3. Print the three-line report:
//    - `runtime: ${detectRuntime()}`
//    - describeArgs(process.argv.slice(2))   <- process appears here only
//    - `node ${process.version}`
