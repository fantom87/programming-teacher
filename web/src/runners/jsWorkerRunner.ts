import type { RunResult } from "@teacher/shared";

// How long the worker stays alive after top-level code returns, so async output
// (setTimeout, promise callbacks) still reaches the pane before we report done.
const ASYNC_GRACE_MS = 300;

// The worker source is static; user code arrives via postMessage and is run with
// indirect eval — no string-splicing of user code into the script. String.raw so
// the regex/string escapes below reach the worker verbatim.
const WORKER_SOURCE = String.raw`
  const send = (type, text) => self.postMessage({ type, text });
  const fmtKey = (k) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k));
  // Tiny node-ish inspect so the pane matches what node (and the server check)
  // prints: undefined → "undefined", NaN → "NaN", 1/0 → "Infinity",
  // functions → "[Function: name]", {a:1} → "{ a: 1 }", [1,2] → "[ 1, 2 ]".
  const inspect = (v, depth, seen) => {
    if (v === null) return "null";
    const t = typeof v;
    if (t === "string") return "'" + v.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
    if (t === "bigint") return String(v) + "n";
    if (t === "function") return v.name ? "[Function: " + v.name + "]" : "[Function (anonymous)]";
    if (t !== "object") return String(v); // undefined, numbers (incl. NaN/±Infinity), booleans, symbols
    if (seen.has(v)) return "[Circular]";
    if (depth <= 0) return Array.isArray(v) ? "[Array]" : "[Object]";
    seen.add(v);
    try {
      if (Array.isArray(v)) {
        const items = v.map((x) => inspect(x, depth - 1, seen));
        return items.length ? "[ " + items.join(", ") + " ]" : "[]";
      }
      const entries = Object.entries(v).map(([k, x]) => fmtKey(k) + ": " + inspect(x, depth - 1, seen));
      return entries.length ? "{ " + entries.join(", ") + " }" : "{}";
    } finally {
      seen.delete(v);
    }
  };
  const fmt = (v) => {
    if (typeof v === "string") return v; // top-level strings print bare, like node
    try { return inspect(v, 3, new Set()); } catch (err) { return String(v); }
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
    let graceTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = (exitCode: number | null, timedOut: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(graceTimer);
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
      else if (type === "done" && graceTimer === undefined) {
        // Top-level code finished; keep the worker alive briefly so async
        // output (setTimeout, promise callbacks) is collected before we finish.
        const exitCode = Number(text);
        graceTimer = setTimeout(() => finish(exitCode, false), ASYNC_GRACE_MS);
      }
    };
    worker.onerror = (e) => {
      stderr += (e.message ?? "Worker error") + "\n";
      finish(1, false);
    };

    worker.postMessage(code);
  });
}
