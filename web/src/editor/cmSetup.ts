import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import type { Language } from "@teacher/shared";

function languageExtension(language: Language, filename: string): Extension {
  if (filename.endsWith(".css")) return css();
  if (filename.endsWith(".html")) return html();
  switch (language) {
    case "python":
      return python();
    case "html-css":
      return html();
    case "csharp":
      return []; // C# highlighting via legacy-modes arrives in M2 with the local runner
    case "javascript":
    default:
      return javascript({ typescript: filename.endsWith(".ts") });
  }
}

export interface EditorOptions {
  parent: HTMLElement;
  doc: string;
  language: Language;
  filename: string;
  dark: boolean;
  fontSize: number;
  onChange: (doc: string) => void;
  onRun: () => void;
}

export function createEditor(opts: EditorOptions): EditorView {
  const runKeymap = keymap.of([
    {
      key: "Ctrl-Enter",
      run: () => {
        opts.onRun();
        return true;
      },
    },
  ]);

  const extensions: Extension[] = [
    runKeymap, // before basicSetup so Ctrl-Enter wins
    basicSetup,
    keymap.of([indentWithTab]),
    languageExtension(opts.language, opts.filename),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) opts.onChange(update.state.doc.toString());
    }),
    EditorView.theme({ "&": { fontSize: `${opts.fontSize}px`, height: "100%" } }),
  ];
  if (opts.dark) extensions.push(oneDark);

  return new EditorView({
    state: EditorState.create({ doc: opts.doc, extensions }),
    parent: opts.parent,
  });
}
