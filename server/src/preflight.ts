import { execFile } from "node:child_process";

export interface RuntimeStatus {
  python: string | null;
  node: string | null;
  dotnet: string | null;
}

function version(command: string, args: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    const child = execFile(command, args, { timeout: 10_000, windowsHide: true }, (err, stdout) => {
      resolve(err ? null : stdout.trim().split("\n")[0] || null);
    });
    child.on("error", () => resolve(null));
  });
}

let cached: RuntimeStatus | null = null;

export async function detectRuntimes(): Promise<RuntimeStatus> {
  if (cached) return cached;
  const [python, node, dotnet] = await Promise.all([
    version("python", ["--version"]),
    version("node", ["--version"]),
    version("dotnet", ["--version"]),
  ]);
  cached = { python, node, dotnet };
  return cached;
}
