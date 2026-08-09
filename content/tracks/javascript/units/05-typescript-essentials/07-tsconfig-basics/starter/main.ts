import { readFileSync } from "node:fs";

// 1. interface CompilerOptions — target: string, strict: boolean,
//    outDir: string.
//    interface TsConfig — compilerOptions: CompilerOptions,
//    include: string[].

// 2. The runner is local, so this reads the real file beside main.ts:
const raw = readFileSync("tsconfig.json", "utf8");
//    Parse it and assert the shape: JSON.parse(raw) as TsConfig

// 3. Print the five-line report from the goal — every value from the
//    parsed object: target and outDir interpolated, "on"/"off" from the
//    strict boolean, the count from include.length.
