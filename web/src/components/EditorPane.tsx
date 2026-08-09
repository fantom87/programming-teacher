import { useEffect, useRef } from "react";
import type { Language } from "@teacher/shared";
import { createEditor, type EditorHandle } from "../editor/cmSetup";
import { useSettings } from "../settingsContext";

interface Props {
  code: string;
  filename: string;
  language: Language;
  dark: boolean;
  running: boolean;
  onChange: (code: string) => void;
  onRun: () => void;
  toolbarExtra?: React.ReactNode;
}

export default function EditorPane({ code, filename, language, dark, running, onChange, onRun, toolbarExtra }: Props) {
  const { fontSize, autocomplete } = useSettings().editor;
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<EditorHandle | null>(null);
  // Keep latest callbacks/options without recreating the editor.
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  const optsRef = useRef({ dark, fontSize, autocomplete });
  onChangeRef.current = onChange;
  onRunRef.current = onRun;
  optsRef.current = { dark, fontSize, autocomplete };

  useEffect(() => {
    if (!hostRef.current) return;
    const handle = createEditor({
      parent: hostRef.current,
      doc: code,
      language,
      filename,
      dark: optsRef.current.dark,
      fontSize: optsRef.current.fontSize,
      autocomplete: optsRef.current.autocomplete,
      onChange: (doc) => onChangeRef.current(doc),
      onRun: () => onRunRef.current(),
    });
    handleRef.current = handle;
    return () => {
      handle.view.destroy();
      handleRef.current = null;
    };
    // Recreate only on language/file change; `code` is only the initial doc.
    // Theme/font/autocomplete swap via compartments below — recreating for
    // those would wipe undo history and cursor position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, filename]);

  useEffect(() => {
    handleRef.current?.setDark(dark);
  }, [dark]);
  useEffect(() => {
    handleRef.current?.setFontSize(fontSize);
  }, [fontSize]);
  useEffect(() => {
    handleRef.current?.setAutocomplete(autocomplete);
  }, [autocomplete]);

  return (
    <>
      <div className="editor-toolbar">
        <span className="filename mono">{filename}</span>
        <span className="spacer" style={{ flex: 1 }} />
        {toolbarExtra}
        <button className="primary" onClick={onRun} disabled={running}>
          {running ? "Running…" : "▶ Run (Ctrl+Enter)"}
        </button>
      </div>
      <div className="editor-host" ref={hostRef} />
    </>
  );
}
