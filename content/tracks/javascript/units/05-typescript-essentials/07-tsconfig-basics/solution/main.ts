import { readFileSync } from "node:fs";

interface CompilerOptions {
  target: string;
  strict: boolean;
  outDir: string;
}

interface TsConfig {
  compilerOptions: CompilerOptions;
  include: string[];
}

const raw = readFileSync("tsconfig.json", "utf8");
const config = JSON.parse(raw) as TsConfig;
const options = config.compilerOptions;

console.log("tsconfig report");
console.log(`target: ${options.target}`);
console.log(`strict mode: ${options.strict ? "on" : "off"}`);
console.log(`output folder: ${options.outDir}`);
console.log(`${config.include.length} folders included`);
