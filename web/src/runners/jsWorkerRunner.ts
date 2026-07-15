import type { RunResult } from "@teacher/shared";

// The worker source is static; user code arrives via postMessage and is run with
// indirect eval — no string-splicing of user code into the script.
const WORKER_SOURCE = `
  const send = (type, text) => self.postMessage({ type, text });
  const fmt = (v) => {
    if (typeof v === "string") return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  };
  for (const m of ["log", "info", "debug"]) {
    console[m] = (...args) => send("stdout", args.map(fmt).join(" "));
  }
  console.warn = (...args) => send("stdout", args.map(fmt).join(" "));
  console.error = (...args) => send("stderr", args.map(fmt).join(" "));
  // No network access inside lesson code.
  self.fetch = undefined;
  self.XMLHttpRequest = undefined;
  self.WebSocket = undefined;
  self.importScripts = undefined;

  self.onmessage = (e) => {
    try {
      (0, eval)(e.data);
      send("done", "0");
    } catch (err) {
      send("stderr", err instanceof Error ? (err.name + ": " + err.message) : String(err));
      send("done", "1");
    }
  };
`;

export function runJs(code: string, timeoutMs = 5000): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = performance.now();
    const blobUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(blobUrl);

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (exitCode: number | null, timedOut: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve({
        ok: exitCode === 0,
        exitCode,
        stdout,
        stderr: timedOut ? stderr + (stderr ? "\n" : "") + `Timed out after ${timeoutMs / 1000}s (infinite loop?)` : stderr,
        durationMs: Math.round(performance.now() - start),
        timedOut,
      });
    };

    const timer = setTimeout(() => finish(null, true), timeoutMs);

    worker.onmessage = (e: MessageEvent<{ type: string; text: string }>) => {
      const { type, text } = e.data;
      if (type === "stdout") stdout += text + "\n";
      else if (type === "stderr") stderr += text + "\n";
      else if (type === "done") finish(Number(text), false);
    };
    worker.onerror = (e) => {
      stderr += (e.message ?? "Worker error") + "\n";
      finish(1, false);
    };

    worker.postMessage(code);
  });
}
