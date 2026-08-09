import { Compartment, EditorState, type Extension } from "@codemirror/state";
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import {
  StreamLanguage,
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { csharp } from "@codemirror/legacy-modes/mode/clike";
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
      return StreamLanguage.define(csharp);
    case "javascript":
    default:
      return javascript({ typescript: filename.endsWith(".ts") });
  }
}

// codemirror's basicSetup, hand-rolled (minus lint, which we don't use) so
// autocompletion can live in a compartment: the Settings toggle switches it
// off without rebuilding the editor. The completion keymap stays registered
// even when completion is off — its commands no-op without completion state.
const baseSetup: Extension = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap]),
];

export interface EditorOptions {
  parent: HTMLElement;
  doc: string;
  language: Language;
  filename: string;
  dark: boolean;
  fontSize: number;
  autocomplete: boolean;
  onChange: (doc: string) => void;
  onRun: () => void;
}

/** Live editor plus reconfigure handles. Theme, font size, and autocomplete
 *  swap via compartments so changing them never destroys undo history,
 *  cursor, or scroll position. */
export interface EditorHandle {
  view: EditorView;
  setDark(dark: boolean): void;
  setFontSize(px: number): void;
  setAutocomplete(on: boolean): void;
}

const themeExt = (dark: boolean): Extension => (dark ? oneDark : []);
const fontExt = (px: number): Extension => EditorView.theme({ "&": { fontSize: `${px}px` } });
const completionExt = (on: boolean): Extension => (on ? autocompletion() : []);

export function createEditor(opts: EditorOptions): EditorHandle {
  const theme = new Compartment();
  const font = new Compartment();
  const completion = new Compartment();

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
    runKeymap, // before the base keymaps so Ctrl-Enter wins
    baseSetup,
    completion.of(completionExt(opts.autocomplete)),
    keymap.of([indentWithTab]),
    languageExtension(opts.language, opts.filename),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) opts.onChange(update.state.doc.toString());
    }),
    EditorView.theme({ "&": { height: "100%" } }),
    font.of(fontExt(opts.fontSize)),
    theme.of(themeExt(opts.dark)),
  ];

  const view = new EditorView({
    state: EditorState.create({ doc: opts.doc, extensions }),
    parent: opts.parent,
  });

  return {
    view,
    setDark: (dark) => view.dispatch({ effects: theme.reconfigure(themeExt(dark)) }),
    setFontSize: (px) => view.dispatch({ effects: font.reconfigure(fontExt(px)) }),
    setAutocomplete: (on) => view.dispatch({ effects: completion.reconfigure(completionExt(on)) }),
  };
}
