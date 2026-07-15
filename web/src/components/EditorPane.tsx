import { useEffect, useRef } from "react";
import type { EditorView } from "@codemirror/view";
import type { Language } from "@teacher/shared";
import { createEditor } from "../editor/cmSetup";

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
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  // Keep latest callbacks without recreating the editor.
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    if (!hostRef.current) return;
    const view = createEditor({
      parent: hostRef.current,
      doc: code,
      language,
      filename,
      dark,
      fontSize: 14,
      onChange: (doc) => onChangeRef.current(doc),
      onRun: () => onRunRef.current(),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Recreate on theme/language/file change; `code` is only the initial doc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark, language, filename]);

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
