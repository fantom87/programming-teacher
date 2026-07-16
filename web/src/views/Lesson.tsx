import { useCallback, useEffect, useRef, useState } from "react";
import { marked } from "marked";
import type { AssistanceLevel, CheckResult, Lesson, RunResult } from "@teacher/shared";
import EditorPane from "../components/EditorPane";
import OutputPane from "../components/OutputPane";
import GoalChecklist from "../components/GoalChecklist";
import HistoryMenu from "../components/HistoryMenu";
import TutorChat from "../components/TutorChat";
import type { TutorEvent } from "../api/tutorStream";
import { runJs } from "../runners/jsWorkerRunner";
import { runPython, warmPyodide, onPyodideStatus, isPyodideWarm } from "../runners/pyodideRunner";
import { buildSrcdoc } from "../runners/htmlPreview";
import { api } from "../api/client";
import type { Route } from "../App";

interface Props {
  lessonKey: string;
  theme: "dark" | "light";
  navigate: (r: Route) => void;
  onProgressChange: () => void;
  onOpenDoc: (slug: string) => void;
}

export default function LessonView({ lessonKey, theme, navigate, onProgressChange, onOpenDoc }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<CheckResult[] | null>(null);
  const [completed, setCompleted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<AssistanceLevel>(3);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [pendingTutorMsg, setPendingTutorMsg] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const resultRef = useRef(result);
  resultRef.current = result;

  useEffect(() => {
    let cancelled = false;
    setLesson(null);
    setResult(null);
    setPreview(null);
    setCheckResults(null);
    setRevealedHints([]);
    (async () => {
      try {
        const l = await api.lesson(lessonKey);
        const draft = await api.draft(lessonKey).catch(() => ({ files: null }));
        if (cancelled) return;
        setLesson(l);
        const initial = draft.files ?? l.starterFiles;
        setFiles(initial);
        setActiveFile(l.files[0]?.path ?? "");
        if (l.language === "html-css") setPreview(buildSrcdoc(initial));
        if (l.language === "python" && l.runner === "browser") {
          warmPyodide();
          if (!isPyodideWarm()) setNotice("Loading Python (one-time, ~13 MB)…");
        }
        const [progress, settings] = await Promise.all([
          api.progress(),
          fetch("/api/settings").then((r) => r.json()),
        ]);
        if (!cancelled) {
          setCompleted(Boolean(progress.lessons[lessonKey]?.completedAt));
          setLevel((settings.assistanceDefault ?? 3) as AssistanceLevel);
        }
        localStorage.setItem("lastLessonKey", lessonKey);
        localStorage.setItem("lastLessonTitle", l.title);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();
    const offStatus = onPyodideStatus((phase) => {
      if (!cancelled && phase === "ready") setNotice(null);
    });
    return () => {
      cancelled = true;
      offStatus();
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
    setFiles((f) => {
      const next = { ...f, [activeFile]: code };
      if (lesson?.language === "html-css") setPreview(buildSrcdoc(next));
      return next;
    });
    scheduleSave();
  }

  async function handleRun() {
    if (!lesson || running) return;
    const entry = lesson.files[0].path;
    setRunning(true);
    try {
      if (lesson.runner === "local") {
        setResult(await api.run(lessonKey, filesRef.current));
      } else if (lesson.language === "javascript") {
        setResult(await runJs(filesRef.current[entry] ?? ""));
        void fetch("/api/snapshots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lessonKey, files: filesRef.current, trigger: "run" }),
        });
      } else if (lesson.language === "python") {
        setResult(await runPython(filesRef.current[entry] ?? ""));
        void fetch("/api/snapshots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lessonKey, files: filesRef.current, trigger: "run" }),
        });
      } else {
        setPreview(buildSrcdoc(filesRef.current));
      }
    } finally {
      setRunning(false);
    }
  }

  async function handleCheck() {
    if (!lesson || checking) return;
    setChecking(true);
    try {
      const res = await api.check(lessonKey, filesRef.current);
      setCheckResults(res.checks);
      if (res.run && lesson.language !== "html-css") setResult(res.run);
      if (res.completed && !completed) {
        setCompleted(true);
        onProgressChange();
      }
    } catch (err) {
      setNotice(String(err));
    } finally {
      setChecking(false);
    }
  }

  function handleRestore(restored: Record<string, string>) {
    setFiles(restored);
    if (lesson?.language === "html-css") setPreview(buildSrcdoc(restored));
    scheduleSave();
    setActiveFile("");
    setTimeout(() => setActiveFile(lesson?.files[0]?.path ?? ""), 0);
  }

  const handleTutorEvent = useCallback(
    (e: TutorEvent) => {
      if (e.type === "check-results") {
        setCheckResults(e.checks);
        if (e.completed) {
          setCompleted(true);
          onProgressChange();
        }
      } else if (e.type === "complete") {
        setCompleted(true);
        onProgressChange();
      } else if (e.type === "hint") {
        setRevealedHints((prev) => (prev.includes(e.index) ? prev : [...prev, e.index].sort()));
      } else if (e.type === "doc") {
        onOpenDoc(e.slug);
      }
    },
    [onProgressChange, onOpenDoc],
  );

  function revealNextHint() {
    if (!lesson?.hints) return;
    const next = lesson.hints.findIndex((_, i) => !revealedHints.includes(i));
    if (next >= 0) setRevealedHints((prev) => [...prev, next].sort());
  }

  if (error) return <div className="view-pad">Failed to load lesson: {error}</div>;
  if (!lesson) return <div className="view-pad">Loading…</div>;

  const hintsAvailable = (lesson.hints?.length ?? 0) > 0 && level >= 2;
  const hintsLeft = (lesson.hints?.length ?? 0) - revealedHints.length;

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
        {(lesson.docs?.length ?? 0) > 0 && (
          <div className="doc-chips">
            {lesson.docs!.map((slug) => (
              <button key={slug} className="doc-chip" onClick={() => onOpenDoc(slug)}>
                📖 {slug.split("/").pop()?.replaceAll("-", " ")}
              </button>
            ))}
          </div>
        )}
        <GoalChecklist checks={lesson.checks} results={checkResults} checking={checking} onCheck={handleCheck} />
        {completed &&
          (lesson.nextLessonKey ? (
            <button
              className="primary next-lesson-btn"
              onClick={() => navigate({ view: "lesson", key: lesson.nextLessonKey! })}
            >
              Next lesson →
            </button>
          ) : (
            <button className="next-lesson-btn" onClick={() => navigate({ view: "track", trackId: lesson.trackId })}>
              🎉 You've finished every lesson here so far — back to the track
            </button>
          ))}
        {revealedHints.length > 0 && (
          <div className="hints-box">
            <div className="label">Hints</div>
            <ol>
              {revealedHints.map((i) => (
                <li key={i}>{lesson.hints?.[i]}</li>
              ))}
            </ol>
          </div>
        )}
        {hintsAvailable && hintsLeft > 0 && (
          <button className="hint-btn" onClick={revealNextHint}>
            💡 Show a hint ({hintsLeft} left)
          </button>
        )}
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
        {activeFile && (
          <EditorPane
            key={`${lessonKey}:${activeFile}`}
            code={files[activeFile] ?? ""}
            filename={activeFile}
            language={lesson.language}
            dark={theme === "dark"}
            running={running}
            onChange={handleChange}
            onRun={handleRun}
            toolbarExtra={
              <>
                <HistoryMenu lessonKey={lessonKey} onRestore={handleRestore} />
                <button onClick={() => handleRestore(lesson.starterFiles)}>Reset</button>
              </>
            }
          />
        )}
        <OutputPane
          result={result}
          preview={lesson.language === "html-css" ? preview : null}
          notice={notice}
          onExplainError={() =>
            setPendingTutorMsg("Please explain this error to me in plain language — what it means and where to look. Don't solve the rest of the lesson for me.")
          }
        />
      </section>

      <section className="pane pane-tutor" aria-label="Tutor">
        <TutorChat
          lessonKey={lessonKey}
          level={level}
          onLevelChange={setLevel}
          getContext={() => ({ files: filesRef.current, lastRun: resultRef.current })}
          onEvent={handleTutorEvent}
          pendingMessage={pendingTutorMsg}
          onPendingConsumed={() => setPendingTutorMsg(null)}
        />
      </section>
    </div>
  );
}
