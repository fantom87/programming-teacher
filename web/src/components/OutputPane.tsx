import type { RunResult } from "@teacher/shared";

interface Props {
  result: RunResult | null;
  /** When set (HTML/CSS lessons), the pane shows a live page preview instead of a console. */
  preview?: string | null;
  notice?: string | null;
}

export default function OutputPane({ result, preview, notice }: Props) {
  return (
    <div className="output-pane">
      <div className="output-header">{preview != null ? "Preview" : "Output"}</div>
      {notice && <div className="output-notice">{notice}</div>}
      {preview != null ? (
        <iframe className="preview-frame" sandbox="allow-scripts" srcDoc={preview} title="Page preview" />
      ) : (
        <pre className="output-body">
          {result === null && <span style={{ color: "var(--text-dim)" }}>Press Run to execute your code.</span>}
          {result && result.stdout && <span className="output-line">{result.stdout}</span>}
          {result && result.stderr && <span className="output-line stderr">{result.stderr}</span>}
          {result && !result.stdout && !result.stderr && (
            <span style={{ color: "var(--text-dim)" }}>(no output)</span>
          )}
        </pre>
      )}
      {result && preview == null && (
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
