import type { CheckResult, CheckSpec } from "@teacher/shared";

interface Props {
  checks: CheckSpec[];
  /** Server-confirmed results (Check my work / tutor check_goal). */
  results: CheckResult[] | null;
  /** Browser-side instant verdicts after a Run — shown dimmed as "preview"
   *  until the server check confirms them. */
  previews?: CheckResult[] | null;
  checking: boolean;
  onCheck: () => void;
}

function describe(spec: CheckSpec): string {
  switch (spec.type) {
    case "stdout":
      return "Program output matches the goal";
    case "tests":
      return "All tests pass";
    case "dom":
      return "Page structure is right";
    case "ai-judge":
      return "Tutor approves the approach";
  }
}

export default function GoalChecklist({ checks, results, previews, checking, onCheck }: Props) {
  return (
    <div className="goal-checklist">
      <ul aria-live="polite">
        {checks.map((spec) => {
          const preview = previews?.find((r) => r.checkId === spec.id);
          const confirmed = results?.find((r) => r.checkId === spec.id);
          const result = preview ?? confirmed;
          const isPreview = preview !== undefined;
          const state =
            result === undefined
              ? "todo"
              : result.unreachable
                ? "unreachable"
                : result.passed
                  ? "pass"
                  : "fail";
          return (
            <li key={spec.id} className={`goal-item ${state}${isPreview ? " preview" : ""}`}>
              <span className="check-icon">
                {state === "pass" ? "✓" : state === "fail" ? "✗" : state === "unreachable" ? "◌" : "○"}
              </span>
              <span>
                {describe(spec)}
                {isPreview && <span className="preview-tag">preview</span>}
                {state === "unreachable" && result && (
                  <div className="check-message unreachable-message">{result.message}</div>
                )}
                {state === "fail" && result && <div className="check-message">{result.message}</div>}
              </span>
            </li>
          );
        })}
      </ul>
      <button className="primary" onClick={onCheck} disabled={checking}>
        {checking ? "Checking…" : "Check my work"}
      </button>
    </div>
  );
}
