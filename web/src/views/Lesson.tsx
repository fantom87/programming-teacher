import { useState } from "react";
import { marked } from "marked";
import type { RunResult } from "@teacher/shared";
import EditorPane from "../components/EditorPane";
import OutputPane from "../components/OutputPane";
import { runJs } from "../runners/jsWorkerRunner";

// M0: one hardcoded lesson. The curriculum engine replaces this in M1.
const DEMO_LESSON = {
  title: "Hello, JavaScript (M0 demo)",
  goal: 'Print "Hello, world!" to the console.',
  filename: "main.js",
  starter: `// Welcome! Type some JavaScript and press Run.\nconsole.log("Hello, world!");\n`,
  body: `
## Your first program

This is the **walking-skeleton demo lesson**. The real curriculum arrives in the next milestone.

A *program* is a list of instructions the computer follows from top to bottom.
The instruction below tells the computer to print some text:

\`\`\`js
console.log("Hello, world!");
\`\`\`

Try changing the message, or add a second line. Then press **Run** (or Ctrl+Enter).
`,
};

export default function LessonView({ theme }: { theme: "dark" | "light" }) {
  const [code, setCode] = useState(DEMO_LESSON.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    try {
      setResult(await runJs(code));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="lesson-layout">
      <section className="pane pane-lesson" aria-label="Lesson">
        <h2>{DEMO_LESSON.title}</h2>
        <div className="goal-box">
          <div className="label">Goal</div>
          {DEMO_LESSON.goal}
        </div>
        <div
          className="lesson-md"
          // Lesson markdown is authored content, not user input.
          dangerouslySetInnerHTML={{ __html: marked.parse(DEMO_LESSON.body) as string }}
        />
      </section>

      <section className="pane pane-work" aria-label="Code workspace">
        <EditorPane
          code={code}
          filename={DEMO_LESSON.filename}
          language="javascript"
          dark={theme === "dark"}
          running={running}
          onChange={setCode}
          onRun={handleRun}
        />
        <OutputPane result={result} />
      </section>

      <section className="pane pane-tutor" aria-label="Tutor">
        <div className="tutor-placeholder">
          <strong>AI Tutor</strong>
          <p>
            The tutor moves in at milestone M3 — chat, assistance slider, goal checking, the works.
            For now, enjoy the peace and quiet.
          </p>
        </div>
      </section>
    </div>
  );
}
