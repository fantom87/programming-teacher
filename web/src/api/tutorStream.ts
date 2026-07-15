import type { CheckResult } from "@teacher/shared";

export type TutorEvent =
  | { type: "text-delta"; text: string }
  | { type: "tool-use"; name: string; detail?: string }
  | { type: "check-results"; checks: CheckResult[]; completed: boolean }
  | { type: "hint"; index: number }
  | { type: "doc"; slug: string }
  | { type: "complete" }
  | { type: "turn-end" }
  | { type: "recommendation"; unitId: string; assistanceLevel: number; reasoning: string }
  | { type: "error"; message: string };

export function openTutorStream(lessonKey: string, onEvent: (e: TutorEvent) => void): () => void {
  const es = new EventSource(`/api/tutor/stream?id=${encodeURIComponent(lessonKey)}`);
  es.onmessage = (e) => {
    try {
      onEvent(JSON.parse(e.data) as TutorEvent);
    } catch {
      // ignore malformed frames
    }
  };
  return () => es.close();
}
