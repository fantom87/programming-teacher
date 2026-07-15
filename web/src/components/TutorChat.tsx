import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import type { AssistanceLevel, RunResult } from "@teacher/shared";
import AssistanceSlider from "./AssistanceSlider";
import { openTutorStream, type TutorEvent } from "../api/tutorStream";

export interface ChatItem {
  role: "user" | "assistant" | "chip";
  text: string;
}

interface Props {
  lessonKey: string;
  level: AssistanceLevel;
  onLevelChange: (level: AssistanceLevel) => void;
  getContext: () => { files: Record<string, string>; lastRun: RunResult | null };
  onEvent: (e: TutorEvent) => void;
  /** Set from outside to send a canned message (e.g. "explain this error"). */
  pendingMessage?: string | null;
  onPendingConsumed?: () => void;
}

const CHIP_LABEL: Record<string, string> = {
  run_code: "Ran your code",
  check_goal: "Checked your goals",
  mark_complete: "Marked complete",
  show_hint: "Revealed a hint",
  show_doc: "Opened a doc page",
  update_profile: "Made a note",
};

export default function TutorChat({ lessonKey, level, onLevelChange, getContext, onEvent, pendingMessage, onPendingConsumed }: Props) {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const streamingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems([]);
    const close = openTutorStream(lessonKey, (e) => {
      onEvent(e);
      if (e.type === "text-delta") {
        setItems((prev) => {
          const next = [...prev];
          if (!streamingRef.current || next.length === 0 || next[next.length - 1].role !== "assistant") {
            next.push({ role: "assistant", text: e.text });
            streamingRef.current = true;
          } else {
            next[next.length - 1] = { role: "assistant", text: next[next.length - 1].text + e.text };
          }
          return next;
        });
      } else if (e.type === "tool-use") {
        streamingRef.current = false;
        setItems((prev) => [...prev, { role: "chip", text: CHIP_LABEL[e.name] ?? e.name }]);
      } else if (e.type === "turn-end") {
        streamingRef.current = false;
        setBusy(false);
      } else if (e.type === "error") {
        streamingRef.current = false;
        setBusy(false);
        setItems((prev) => [...prev, { role: "chip", text: `⚠ ${e.message}` }]);
      }
    });
    return close;
  }, [lessonKey, onEvent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [items]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setItems((prev) => [...prev, { role: "user", text: trimmed }]);
    setBusy(true);
    setInput("");
    const ctx = getContext();
    try {
      await fetch("/api/tutor/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lessonKey, text: trimmed, files: ctx.files, lastRun: ctx.lastRun, level }),
      });
    } catch (err) {
      setBusy(false);
      setItems((prev) => [...prev, { role: "chip", text: `⚠ ${String(err)}` }]);
    }
  }

  useEffect(() => {
    if (pendingMessage) {
      void send(pendingMessage);
      onPendingConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMessage]);

  function handleLevel(l: AssistanceLevel) {
    onLevelChange(l);
    void fetch("/api/tutor/level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lessonKey, level: l }),
    });
  }

  return (
    <div className="tutor-chat">
      <div className="tutor-header">
        <AssistanceSlider level={level} onChange={handleLevel} />
      </div>
      <div className="chat-scroll" ref={scrollRef}>
        {items.length === 0 && (
          <p className="dim small chat-empty">
            Ask the tutor anything about this lesson — or just say hello. Slide the assistance level to change how much help you get.
          </p>
        )}
        {items.map((item, i) =>
          item.role === "chip" ? (
            <div key={i} className="chat-chip">
              {item.text}
            </div>
          ) : (
            <div key={i} className={`chat-msg ${item.role}`}>
              {item.role === "assistant" ? (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(item.text) as string }} />
              ) : (
                item.text
              )}
            </div>
          ),
        )}
        {busy && <div className="chat-chip">thinking…</div>}
      </div>
      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          className="chat-input"
          value={input}
          placeholder="Ask the tutor…"
          aria-label="Message the tutor"
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="primary" type="submit" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
