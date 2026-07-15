import { useCallback, useEffect, useRef, useState } from "react";
import { marked } from "marked";
import type { Lesson, RunResult } from "@teacher/shared";
import EditorPane from "../components/EditorPane";
import OutputPane from "../components/OutputPane";
import { runJs } from "../runners/jsWorkerRunner";
import { api } from "../api/client";
import type { Route } from "../App";

interface Props {
  lessonKey: string;
  theme: "dark" | "light";
  navigate: (r: Route) => void;
  onProgressChange: () => void;
}

export default function LessonView({ lessonKey, theme, navigate, onProgressChange }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    let cancelled = false;
    setLesson(null);
    setResult(null);
    (async () => {
      try {
        const l = await api.lesson(lessonKey);
        const draft = await api.draft(lessonKey).catch(() => ({ files: null }));
        if (cancelled) return;
        setLesson(l);
        setFiles(draft.files ?? l.starterFiles);
        setActiveFile(l.files[0]?.path ?? "");
        const progress = await api.progress();
        if (!cancelled) setCompleted(Boolean(progress.lessons[lessonKey]?.completedAt));
        localStorage.setItem("lastLessonKey", lessonKey);
        localStorage.setItem("lastLessonTitle", l.title);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();
    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [lessonKey]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveDraft(lessonKey, filesRef.current).catch(console.error);
    }, 800);
  }, [lessonKey]);

  function handleChange(code: string) {
    setFiles((f) => ({ ...f, [activeFile]: code }));
    scheduleSave();
  }

  async function handleRun() {
    if (!lesson) return;
    if (lesson.runner !== "browser" || lesson.language !== "javascript") {
      setResult({
        ok: false,
        exitCode: null,
        stdout: "",
        stderr: "This lesson's runner arrives in milestone M2.",
        durationMs: 0,
        timedOut: false,
      });
      return;
    }
    setRunning(true);
    try {
      setResult(await runJs(files[lesson.files[0].path] ?? ""));
    } finally {
      setRunning(false);
    }
  }

  async function handleComplete() {
    await api.completeLesson(lessonKey);
    setCompleted(true);
    onProgressChange();
  }

  function handleReset() {
    if (!lesson) return;
    setFiles(lesson.starterFiles);
    scheduleSave();
  }

  if (error) return <div className="view-pad">Failed to load lesson: {error}</div>;
  if (!lesson) return <div className="view-pad">Loading…</div>;

  return (
    <div className="lesson-layout">
      <section className="pane pane-lesson" aria-label="Lesson">
        <button className="back-link" onClick={() => navigate({ view: "track", trackId: lesson.trackId })}>
          ← Back to {lesson.trackId}
        </button>
        <h2>
          {lesson.title} {completed && <span className="check done">✓</span>}
        </h2>
        <div className="goal-box">
          <div className="label">Goal</div>
          {lesson.goal}
        </div>
        <div className="lesson-md" dangerouslySetInnerHTML={{ __html: marked.parse(lesson.body) as string }} />
      </section>

      <section className="pane pane-work" aria-label="Code workspace">
        {lesson.files.length > 1 && (
          <div className="file-tabs" role="tablist">
            {lesson.files.map((f) => (
              <button
                key={f.path}
                role="tab"
                aria-selected={activeFile === f.path}
                className={`file-tab ${activeFile === f.path ? "active" : ""}`}
                onClick={() => setActiveFile(f.path)}
              >
                {f.path}
              </button>
            ))}
          </div>
        )}
        <EditorPane
          key={`${lessonKey}:${activeFile}`}
          code={files[activeFile] ?? ""}
          filename={activeFile}
          language={lesson.language}
          dark={theme === "dark"}
          running={running}
          onChange={handleChange}
          onRun={handleRun}
        />
        <OutputPane result={result} />
      </section>

      <section className="pane pane-tutor" aria-label="Tutor">
        <div className="tutor-placeholder">
          <strong>AI Tutor</strong>
          <p>The tutor moves in at milestone M3.</p>
          <hr />
          <button onClick={handleReset}>Reset to starter code</button>
          {!completed && (
            <button className="primary" style={{ marginTop: 8 }} onClick={handleComplete}>
              Mark complete (dev)
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
