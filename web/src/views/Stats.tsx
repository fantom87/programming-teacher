import { useEffect, useState } from "react";
import type { JournalEntry, Progress } from "@teacher/shared";

export default function Stats() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  useEffect(() => {
    fetch("/api/progress").then((r) => r.json()).then(setProgress).catch(console.error);
    fetch("/api/journal").then((r) => r.json()).then(setJournal).catch(console.error);
  }, []);

  if (!progress) return <div className="view-pad">Loading…</div>;

  const completed = Object.values(progress.lessons).filter((l) => l.completedAt).length;
  const byTrack = new Map<string, number>();
  for (const [key, lp] of Object.entries(progress.lessons)) {
    if (lp.completedAt) {
      const track = key.split("/")[0];
      byTrack.set(track, (byTrack.get(track) ?? 0) + 1);
    }
  }

  return (
    <div className="view-pad">
      <h1>Your progress</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{completed}</div>
          <div className="dim small">lessons completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥 {progress.streak.current}</div>
          <div className="dim small">day streak (best: {progress.streak.best})</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress.totals.runs}</div>
          <div className="dim small">code runs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {progress.totals.checksPassed}<span className="dim">/{progress.totals.checksPassed + progress.totals.checksFailed}</span>
          </div>
          <div className="dim small">checks passed</div>
        </div>
      </div>

      {byTrack.size > 0 && (
        <p className="dim small">
          By track: {[...byTrack.entries()].map(([t, n]) => `${t} ${n}`).join(" · ")}
        </p>
      )}

      <h2>Learning journal</h2>
      {journal.length === 0 && (
        <p className="dim">
          When you complete a lesson with the tutor, it writes a short "what you learned" entry here.
        </p>
      )}
      <ol className="journal-list">
        {[...journal].reverse().map((e, i) => (
          <li key={i} className="journal-entry">
            <div className="dim small">
              {new Date(e.completedAt).toLocaleDateString()} · {e.lessonId.split("/").pop()?.replace(/^\d+-/, "").replaceAll("-", " ")}
            </div>
            <div>{e.summary}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
