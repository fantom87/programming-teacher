import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistanceLevel, Language, RunResult } from "@teacher/shared";
import EditorPane from "../components/EditorPane";
import OutputPane from "../components/OutputPane";
import TutorChat from "../components/TutorChat";
import { runJs } from "../runners/jsWorkerRunner";
import { runPython, warmPyodide } from "../runners/pyodideRunner";
import { buildSrcdoc } from "../runners/htmlPreview";
import { api } from "../api/client";

const ENTRY: Record<Language, string> = {
  python: "main.py",
  javascript: "main.js",
  "html-css": "index.html",
  csharp: "Program.cs",
};

const LABEL: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  "html-css": "HTML/CSS",
  csharp: "C#",
};

export default function Playground({ theme }: { theme: "dark" | "light" }) {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState<AssistanceLevel>(3);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef(code);
  codeRef.current = code;
  const resultRef = useRef(result);
  resultRef.current = result;

  const entry = ENTRY[language];
  const draftId = `playground-${language}`;
  const tutorKey = `playground/${language}/scratch`;

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setPreview(null);
    api
      .draft(draftId)
      .then((d) => {
        if (!cancelled) {
          const c = d.files?.[entry] ?? "";
          setCode(c);
          if (language === "html-css") setPreview(buildSrcdoc({ [entry]: c }));
        }
      })
      .catch(() => setCode(""));
    if (language === "python") warmPyodide();
    return () => {
      cancelled = true;
    };
  }, [language, draftId, entry]);

  function handleChange(next: string) {
    setCode(next);
    if (language === "html-css") setPreview(buildSrcdoc({ [entry]: next }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveDraft(draftId, { [entry]: codeRef.current }).catch(() => {});
    }, 800);
  }

  async function handleRun() {
    if (running) return;
    setRunning(true);
    try {
      if (language === "javascript") setResult(await runJs(codeRef.current));
      else if (language === "python") setResult(await runPython(codeRef.current));
      else if (language === "html-css") setPreview(buildSrcdoc({ [entry]: codeRef.current }));
      else setResult(await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: tutorKey, files: { [entry]: codeRef.current } }),
      }).then((r) => r.json()));
    } finally {
      setRunning(false);
    }
  }

  const noop = useCallback(() => {}, []);

  return (
    <div className="lesson-layout">
      <section className="pane pane-work playground-work" aria-label="Playground workspace">
        <div className="file-tabs" role="tablist" aria-label="Playground language">
          {(Object.keys(ENTRY) as Language[]).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={language === l}
              className={`file-tab ${language === l ? "active" : ""}`}
              onClick={() => setLanguage(l)}
            >
              {LABEL[l]}
            </button>
          ))}
        </div>
        <EditorPane
          key={`${language}`}
          code={code}
          filename={entry}
          language={language}
          dark={theme === "dark"}
          running={running}
          onChange={handleChange}
          onRun={handleRun}
        />
        <OutputPane result={result} preview={language === "html-css" ? preview : null} />
      </section>
      <section className="pane pane-tutor" aria-label="Tutor">
        <TutorChat
          lessonKey={tutorKey}
          level={level}
          onLevelChange={setLevel}
          getContext={() => ({ files: { [entry]: codeRef.current }, lastRun: resultRef.current })}
          onEvent={noop}
        />
      </section>
    </div>
  );
}
