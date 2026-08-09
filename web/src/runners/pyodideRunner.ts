import type { RunResult } from "@teacher/shared";

// Pyodide manager: keeps one warm worker; on timeout the worker is terminated
// and a replacement is warmed immediately so the next run doesn't pay the
// full load cost visibly.
//
// The worker is built from an inline source string (same pattern as
// jsWorkerRunner) — Vite's dev-mode worker transform proved unreliable for
// dynamic-importing the self-hosted /pyodide/pyodide.mjs distribution.

const WORKER_SOURCE = `
  let pyodideReady = null;

  const sendOut = (s) => postMessage({ type: "stdout", text: s });
  const sendErr = (s) => postMessage({ type: "stderr", text: s });

  // (Re)install output capture. Re-armed before every run so a learner who
  // reassigns sys.stdout can't kill capture for all later runs.
  function armCapture(py) {
    py.setStdout({ batched: sendOut });
    py.setStderr({ batched: sendErr });
  }

  function getPyodide() {
    if (!pyodideReady) {
      pyodideReady = (async () => {
        const mod = await import(${JSON.stringify(`${location?.origin ?? ""}/pyodide/pyodide.mjs`)});
        const py = await mod.loadPyodide({ indexURL: ${JSON.stringify(`${location?.origin ?? ""}/pyodide/`)} });
        armCapture(py);
        return py;
      })();
    }
    return pyodideReady;
  }

  function trimTraceback(msg) {
    const lines = msg.split("\\n");
    const start = lines.findIndex((l) => l.includes('File "<exec>"'));
    return start > 0 ? ["Traceback (most recent call last):", ...lines.slice(start)].join("\\n") : msg;
  }

  self.onmessage = async (e) => {
    if (e.data.type === "warm") {
      try {
        await getPyodide();
        postMessage({ type: "ready" });
      } catch (err) {
        postMessage({ type: "stderr", text: "Python failed to load: " + String(err) });
      }
      return;
    }
    if (e.data.type !== "run") return;
    try {
      const py = await getPyodide();
      armCapture(py);
      // Run against fresh globals so each run mirrors the server's
      // fresh-process semantics — stale bindings from an earlier run can't
      // make Run pass code that Check fails.
      const globals = py.runPython('dict(__name__="__main__")');
      try {
        py.runPython(e.data.code, { globals });
      } finally {
        // Deliver any output still buffered by print(..., end="") etc.
        try { py.runPython("import sys; sys.stdout.flush(); sys.stderr.flush()"); } catch (err) {}
        try { globals.destroy(); } catch (err) {}
      }
      postMessage({ type: "done", ok: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      postMessage({ type: "stderr", text: trimTraceback(msg) });
      postMessage({ type: "done", ok: false });
    }
  };
`;

type Listener = (phase: "loading" | "ready") => void;

let worker: Worker | null = null;
let warm = false;
const listeners = new Set<Listener>();

export function onPyodideStatus(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(phase: "loading" | "ready") {
  for (const fn of listeners) fn(phase);
}

function createWorker(): Worker {
  const blobUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const w = new Worker(blobUrl, { type: "module" });
  w.addEventListener("message", (e: MessageEvent<{ type: string }>) => {
    if (e.data.type === "ready") {
      warm = true;
      notify("ready");
    }
  });
  notify("loading");
  w.postMessage({ type: "warm" });
  return w;
}

export function warmPyodide(): void {
  if (!worker) worker = createWorker();
}

export function runPython(code: string, timeoutMs = 15_000): Promise<RunResult> {
  if (!worker) worker = createWorker();
  const w = worker;

  return new Promise((resolve) => {
    const start = performance.now();
    // Batched stdout chunks are lines; collect them verbatim and join once so
    // empty lines (including a leading blank line) survive.
    const stdoutLines: string[] = [];
    let stderr = "";
    let settled = false;

    const finish = (ok: boolean, timedOut: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      resolve({
        ok: ok && !timedOut,
        exitCode: ok ? 0 : 1,
        stdout: stdoutLines.length ? stdoutLines.join("\n") + "\n" : "",
        stderr:
          stderr +
          (timedOut ? (stderr ? "\n" : "") + `Timed out after ${timeoutMs / 1000}s (infinite loop?)` : ""),
        durationMs: Math.round(performance.now() - start),
        timedOut,
      });
    };

    const timer = setTimeout(() => {
      // Terminate the stuck interpreter and warm a fresh one for next time.
      w.terminate();
      warm = false;
      worker = createWorker();
      finish(false, true);
    }, timeoutMs);

    const onMessage = (e: MessageEvent<{ type: string; text?: string; ok?: boolean }>) => {
      const m = e.data;
      if (m.type === "stdout") stdoutLines.push(m.text ?? "");
      else if (m.type === "stderr") stderr += (m.text ?? "") + "\n";
      else if (m.type === "done") finish(Boolean(m.ok), false);
    };

    w.addEventListener("message", onMessage);
    w.postMessage({ type: "run", code });
  });
}

export function isPyodideWarm(): boolean {
  return warm;
}
