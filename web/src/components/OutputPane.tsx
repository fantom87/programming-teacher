import type { RunResult } from "@teacher/shared";

export default function OutputPane({ result }: { result: RunResult | null }) {
  return (
    <div className="output-pane">
      <div className="output-header">Output</div>
      <pre className="output-body">
        {result === null && <span style={{ color: "var(--text-dim)" }}>Press Run to execute your code.</span>}
        {result && result.stdout && <span className="output-line">{result.stdout}</span>}
        {result && result.stderr && <span className="output-line stderr">{result.stderr}</span>}
        {result && !result.stdout && !result.stderr && (
          <span style={{ color: "var(--text-dim)" }}>(no output)</span>
        )}
      </pre>
      {result && (
        <div className={`output-status ${result.ok ? "ok" : "fail"}`}>
          {result.timedOut
            ? "⏱ timed out"
            : result.ok
              ? `✓ finished in ${result.durationMs} ms`
              : `✗ exited with code ${result.exitCode ?? "?"} in ${result.durationMs} ms`}
        </div>
      )}
    </div>
  );
}
