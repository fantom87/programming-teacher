import type { CheckResult, CheckSpec } from "@teacher/shared";

interface Props {
  checks: CheckSpec[];
  results: CheckResult[] | null;
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

export default function GoalChecklist({ checks, results, checking, onCheck }: Props) {
  return (
    <div className="goal-checklist">
      <ul>
        {checks.map((spec) => {
          const result = results?.find((r) => r.checkId === spec.id);
          const state = result === undefined ? "todo" : result.passed ? "pass" : "fail";
          return (
            <li key={spec.id} className={`goal-item ${state}`}>
              <span className="check-icon">{state === "pass" ? "✓" : state === "fail" ? "✗" : "○"}</span>
              <span>
                {describe(spec)}
                {result && !result.passed && <div className="check-message">{result.message}</div>}
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
