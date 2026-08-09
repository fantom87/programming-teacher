import { useEffect, useRef, useState } from "react";
import {
  api,
  ApiError,
  type CustomLessonDifficulty,
  type CustomLessonPreview,
} from "../api/client";
import type { CheckResult, CheckSpec } from "@teacher/shared";
import { renderMarkdown } from "../md";

// "Teach me to do X" modal (plan §17.2): describe a goal, watch the tutor
// write and verify a lesson, preview it, then accept it into the track.

interface Props {
  trackId: string;
  trackTitle: string;
  onClose: () => void;
  onAccepted: (lessonKey: string) => void;
}

type Phase =
  | { kind: "form" }
  | { kind: "generating"; jobId: string }
  | { kind: "ready"; jobId: string; lesson: CustomLessonPreview; checks: CheckResult[] }
  | { kind: "failed"; error: string };

const POLL_MS = 2500;

function checkLabel(spec: CheckSpec): string {
  switch (spec.type) {
    case "stdout":
      return `Output ${spec.match === "exact" ? "matches exactly" : spec.match === "contains" ? "contains the expected text" : "matches a pattern"}`;
    case "tests":
      return "Automated tests pass";
    case "dom":
      return `Page structure is right (${spec.assertions.length} assertion${spec.assertions.length === 1 ? "" : "s"})`;
    case "ai-judge":
      return "The tutor approves your approach";
  }
}

export default function CustomLessonModal({ trackId, trackTitle, onClose, onAccepted }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "form" });
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState<CustomLessonDifficulty>("beginner");
  const [busy, setBusy] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Poll the job while generating.
  useEffect(() => {
    if (phase.kind !== "generating") return;
    const { jobId } = phase;
    const timer = window.setInterval(() => {
      api
        .customLessonStatus(jobId)
        .then((s) => {
          if (s.state === "ready" && s.lesson) {
            setPhase({ kind: "ready", jobId, lesson: s.lesson, checks: s.checks ?? [] });
          } else if (s.state === "failed") {
            setPhase({ kind: "failed", error: s.error ?? "Generation failed." });
          }
        })
        .catch((err) => {
          if (err instanceof ApiError && err.status === 404) {
            setPhase({ kind: "failed", error: "The job expired — try again." });
          }
          // network blips: keep polling
        });
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [phase]);

  function discardIfActive() {
    const p = phaseRef.current;
    if (p.kind === "generating" || p.kind === "ready") {
      api.discardCustomLesson(p.jobId).catch(() => {});
    }
  }

  function close() {
    discardIfActive();
    onClose();
  }

  async function generate() {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    try {
      const { jobId } = await api.createCustomLesson(trackId, prompt.trim(), difficulty);
      setPhase({ kind: "generating", jobId });
    } catch (err) {
      setPhase({ kind: "failed", error: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  async function accept() {
    if (phase.kind !== "ready" || busy) return;
    setBusy(true);
    setAcceptError(null);
    try {
      const { key } = await api.acceptCustomLesson(phase.jobId);
      onAccepted(key);
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }

  async function discard() {
    if (phase.kind === "ready" || phase.kind === "generating") {
      api.discardCustomLesson(phase.jobId).catch(() => {});
    }
    onClose();
  }

  const resultFor = (checks: CheckResult[], spec: CheckSpec): CheckResult | undefined =>
    checks.find((c) => c.checkId === spec.id);

  return (
    <div
      className="modal-backdrop"
      onClick={close}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
      }}
    >
      <div
        className="modal custom-lesson-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Custom lesson"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <strong>✨ Custom lesson — {trackTitle}</strong>
          <button aria-label="Close custom lesson dialog" onClick={close}>
            ✕
          </button>
        </div>

        {phase.kind === "form" && (
          <div className="modal-body">
            <label className="modal-label" htmlFor="custom-goal">
              What do you want to learn to do?
            </label>
            <textarea
              id="custom-goal"
              ref={textareaRef}
              className="custom-goal-input"
              placeholder='e.g. "I want to practice reversing strings and lists" or "teach me to parse a CSV and total a column"'
              value={prompt}
              maxLength={2000}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <label className="modal-label" htmlFor="custom-difficulty">
              Difficulty
            </label>
            <select
              id="custom-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as CustomLessonDifficulty)}
            >
              <option value="beginner">Beginner — explain it from scratch</option>
              <option value="intermediate">Intermediate — I know the basics</option>
              <option value="advanced">Advanced — challenge me</option>
            </select>
            <div className="modal-actions">
              <button onClick={close}>Cancel</button>
              <button className="primary" disabled={!prompt.trim() || busy} onClick={generate}>
                Generate
              </button>
            </div>
          </div>
        )}

        {phase.kind === "generating" && (
          <div className="modal-body gen-progress" role="status">
            <div className="gen-spinner" aria-hidden="true" />
            <p>
              <strong>Writing your lesson…</strong> this takes a minute or two.
            </p>
            <p className="dim small">
              The tutor drafts the lesson, then its solution is run against its own checks — only a lesson that
              provably works gets shown to you.
            </p>
            <div className="modal-actions">
              <button onClick={close}>Cancel</button>
            </div>
          </div>
        )}

        {phase.kind === "ready" && (
          <div className="modal-body">
            <h2 className="preview-title">
              {phase.lesson.title} <span className="dim small">~{phase.lesson.estMinutes} min</span>
            </h2>
            <div className="goal-box">
              <div className="label">Goal</div>
              {phase.lesson.goal}
            </div>
            <div className="check-summary">
              <div className="label">Goal checks</div>
              <ul>
                {phase.lesson.checks.map((spec) => {
                  const result = resultFor(phase.checks, spec);
                  return (
                    <li key={spec.id}>
                      <span className={`check-badge ${spec.type === "ai-judge" ? "live" : result?.passed ? "verified" : ""}`}>
                        {spec.type === "ai-judge" ? "AI-graded live" : result?.passed ? "✓ verified" : "not verified"}
                      </span>
                      <span>{checkLabel(spec)}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="dim small">
                “Verified” means the lesson's own reference solution passed this check just now.
              </p>
            </div>
            <div className="lesson-md preview-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(phase.lesson.body) }} />
            {acceptError && (
              <p className="error-text" role="alert">
                {acceptError}
              </p>
            )}
            <div className="modal-actions">
              <button onClick={discard} disabled={busy}>
                Discard
              </button>
              <button className="primary" onClick={accept} disabled={busy}>
                {busy ? "Adding…" : "Accept — add to my track"}
              </button>
            </div>
          </div>
        )}

        {phase.kind === "failed" && (
          <div className="modal-body">
            <p className="error-text" role="alert">
              {phase.error}
            </p>
            <p className="dim small">
              Try rephrasing your request — shorter, more concrete goals work best (“practice reversing strings”
              beats “teach me everything about strings”).
            </p>
            <div className="modal-actions">
              <button onClick={close}>Close</button>
              <button className="primary" onClick={() => setPhase({ kind: "form" })}>
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
