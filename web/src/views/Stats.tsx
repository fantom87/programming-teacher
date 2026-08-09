import { useCallback, useEffect, useState } from "react";
import type { JournalEntry, Progress, Tier } from "@teacher/shared";
import { api, type TrackView } from "../api/client";

const TIER_ORDER: Tier[] = ["foundations", "core", "intermediate", "advanced", "refresher", "custom"];

function tierRollup(track: TrackView): Map<Tier, { done: number; total: number }> {
  const rollup = new Map<Tier, { done: number; total: number }>();
  for (const u of track.units) {
    if (u.lessons.length === 0) continue; // planned units have nothing to complete
    const entry = rollup.get(u.tier) ?? { done: 0, total: 0 };
    entry.total += u.lessons.length;
    entry.done += u.lessons.filter((l) => l.completedAt).length;
    rollup.set(u.tier, entry);
  }
  return rollup;
}

export default function Stats() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [tracks, setTracks] = useState<TrackView[]>([]);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.progress().then(setProgress).catch(() => setError(true));
    api.journal().then(setJournal).catch(() => {});
    api.curriculum().then((c) => setTracks(c.tracks)).catch(() => {});
  }, []);

  useEffect(load, [load]);

  if (error && !progress) {
    return (
      <div className="view-pad">
        <h1>Can't reach the local server</h1>
        <p className="dim">The app's local server isn't answering — it may have stopped.</p>
        <button className="primary" onClick={load}>
          Retry
        </button>
      </div>
    );
  }
  if (!progress) return <div className="view-pad">Loading…</div>;

  const completed = Object.values(progress.lessons).filter((l) => l.completedAt).length;

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

      {tracks.length > 0 && (
        <>
          <h2>By track and tier</h2>
          <ul className="tier-rollup-list">
            {tracks.map((t) => {
              const rollup = tierRollup(t);
              if (rollup.size === 0) return null;
              return (
                <li key={t.id} className="tier-rollup">
                  <strong>{t.title}</strong>{" "}
                  <span className="dim small">
                    {TIER_ORDER.filter((tier) => rollup.has(tier))
                      .map((tier) => `${tier} ${rollup.get(tier)!.done}/${rollup.get(tier)!.total}`)
                      .join(" · ")}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
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
