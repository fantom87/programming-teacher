import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistanceLevel, Language, RunResult } from "@teacher/shared";
import EditorPane from "../components/EditorPane";
import OutputPane from "../components/OutputPane";
import TutorChat from "../components/TutorChat";
import { runJs } from "../runners/jsWorkerRunner";
import { runPython, warmPyodide } from "../runners/pyodideRunner";
import { runSql, warmSqlJs } from "../runners/sqlRunner";
import { buildSrcdoc } from "../runners/htmlPreview";
import { api } from "../api/client";
import { useTutorStatus } from "../api/useTutorStatus";
import { tabListKeyDown } from "./Lesson";

const ENTRY: Record<Language, string> = {
  python: "main.py",
  javascript: "main.js",
  "html-css": "index.html",
  csharp: "Program.cs",
  sql: "query.sql",
  powershell: "script.ps1",
  bash: "script.sh",
  go: "main.go",
  rust: "main.rs",
};

const LABEL: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  "html-css": "HTML/CSS",
  csharp: "C#",
  sql: "SQL",
  powershell: "PowerShell",
  bash: "Bash",
  go: "Go",
  rust: "Rust",
};

const LANGUAGES = Object.keys(ENTRY) as Language[];

export default function Playground({ theme }: { theme: "dark" | "light" }) {
  const [language, setLanguage] = useState<Language>("python");
  // Per-language code map: switching tabs never leaks one language's buffer
  // into another's editor or draft.
  const [codeMap, setCodeMap] = useState<Partial<Record<Language, string>>>({});
  // generation per language, set once its draft fetch resolves — the editor
  // renders only after that, keyed by language+generation.
  const [loadedGen, setLoadedGen] = useState<Partial<Record<Language, number>>>({});
  const [result, setResult] = useState<RunResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState<AssistanceLevel>(3);
  const { available: tutorAvailable, state: tutorState } = useTutorStatus();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<{ draftId: string; entry: string; language: Language } | null>(null);
  const genCounter = useRef(0);
  const codeMapRef = useRef(codeMap);
  codeMapRef.current = codeMap;
  const resultRef = useRef(result);
  resultRef.current = result;

  const entry = ENTRY[language];
  const draftId = `playground-${language}`;
  const tutorKey = `playground/${language}/scratch`;

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setNotice(null);
    setPreview(language === "html-css" ? buildSrcdoc({ [entry]: codeMapRef.current[language] ?? "" }) : null);
    if (language === "python") warmPyodide();
    if (language === "sql") warmSqlJs();
    // Fetch each language's draft once; after that the in-memory map is the
    // source of truth (a refetch would clobber unsaved edits).
    if (loadedGen[language] === undefined) {
      api
        .draft(draftId)
        .then((d) => {
          if (cancelled) return;
          const c = d.files?.[entry] ?? "";
          setCodeMap((m) => ({ ...m, [language]: c }));
          if (language === "html-css") setPreview(buildSrcdoc({ [entry]: c }));
          setLoadedGen((g) => ({ ...g, [language]: ++genCounter.current }));
        })
        .catch(() => {
          if (cancelled) return;
          // No saved draft (or server hiccup) — start empty rather than block.
          setCodeMap((m) => ({ ...m, [language]: m[language] ?? "" }));
          setLoadedGen((g) => ({ ...g, [language]: ++genCounter.current }));
        });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Flush (don't discard) a pending draft save on tab switch or unmount, using
  // the language captured at schedule time — no cross-language contamination.
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
        const p = pendingSave.current;
        pendingSave.current = null;
        if (p) api.saveDraft(p.draftId, { [p.entry]: codeMapRef.current[p.language] ?? "" }).catch(() => {});
      }
    };
  }, [language]);

  function handleChange(next: string) {
    const lang = language;
    const id = draftId;
    const ent = entry;
    setCodeMap((m) => ({ ...m, [lang]: next }));
    if (lang === "html-css") setPreview(buildSrcdoc({ [ent]: next }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    pendingSave.current = { draftId: id, entry: ent, language: lang };
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      pendingSave.current = null;
      api.saveDraft(id, { [ent]: codeMapRef.current[lang] ?? "" }).catch(() => {});
    }, 800);
  }

  async function handleRun() {
    if (running) return;
    setRunning(true);
    setNotice(null);
    const src = codeMapRef.current[language] ?? "";
    try {
      if (language === "javascript") setResult(await runJs(src));
      else if (language === "python") setResult(await runPython(src));
      else if (language === "sql") setResult(await runSql({ [entry]: src }, entry));
      else if (language === "html-css") setPreview(buildSrcdoc({ [entry]: src }));
      else setResult(await api.run(tutorKey, { [entry]: src }));
    } catch (err) {
      // api.run throws ApiError with the server's friendly text (e.g. the
      // winget command when the .NET SDK is missing).
      setNotice(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  const noop = useCallback(() => {}, []);

  return (
    <div className="lesson-layout">
      <section className="pane pane-work playground-work" aria-label="Playground workspace">
        <div className="file-tabs" role="tablist" aria-label="Playground language">
          {LANGUAGES.map((l, i) => (
            <button
              key={l}
              role="tab"
              aria-selected={language === l}
              tabIndex={language === l ? 0 : -1}
              className={`file-tab ${language === l ? "active" : ""}`}
              onClick={() => setLanguage(l)}
              onKeyDown={(e) => tabListKeyDown(e, i, LANGUAGES.length, (n) => setLanguage(LANGUAGES[n]))}
            >
              {LABEL[l]}
            </button>
          ))}
        </div>
        {loadedGen[language] !== undefined ? (
          <EditorPane
            key={`${language}:${loadedGen[language]}`}
            code={codeMap[language] ?? ""}
            filename={entry}
            language={language}
            dark={theme === "dark"}
            running={running}
            onChange={handleChange}
            onRun={handleRun}
          />
        ) : (
          <div className="editor-loading dim small">Loading draft…</div>
        )}
        <OutputPane result={result} preview={language === "html-css" ? preview : null} notice={notice} />
      </section>
      <section className="pane pane-tutor" aria-label="Tutor">
        <TutorChat
          lessonKey={tutorKey}
          level={level}
          onLevelChange={setLevel}
          getContext={() => ({ files: { [entry]: codeMapRef.current[language] ?? "" }, lastRun: resultRef.current })}
          onEvent={noop}
          tutorAvailable={tutorAvailable}
          tutorState={tutorState}
        />
      </section>
    </div>
  );
}
