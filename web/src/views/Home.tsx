import { useCallback, useEffect, useState } from "react";
import type { Progress } from "@teacher/shared";
import { completionCounts } from "../counts";
import { api, type CurriculumResponse, type TrackView } from "../api/client";
import ProgressBar from "../components/ProgressBar";
import type { Route } from "../App";

function trackStats(track: TrackView) {
  let done = 0;
  let authored = 0;
  let planned = 0;
  for (const u of track.units) {
    const projects = u.projects ?? [];
    authored += u.lessons.length + projects.length;
    planned += u.plannedLessons?.length ?? 0;
    if (u.planned && u.topics) planned += u.topics.length; // rough size of unauthored units
    done += u.lessons.filter((l) => l.completedAt).length + projects.filter((p) => p.completedAt).length;
  }
  return { done, authored, planned };
}

export default function Home({ navigate }: { navigate: (r: Route) => void }) {
  const [data, setData] = useState<CurriculumResponse | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState(false);
  const lastLesson = localStorage.getItem("lastLessonKey");
  const lastLessonTitle = localStorage.getItem("lastLessonTitle");

  const load = useCallback(() => {
    setError(false);
    api.curriculum().then(setData).catch(() => setError(true));
    api.progress().then(setProgress).catch(() => {});
  }, []);

  useEffect(load, [load]);

  if (error && !data) {
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
  if (!data) return <div className="view-pad">Loading…</div>;

  const counts = completionCounts(data.tracks);

  return (
    <div className="view-pad home">
      <h1>Welcome back</h1>
      {progress && (
        <p className="stats-strip dim small">
          🔥 {progress.streak.current}-day streak · {counts.lessons} lesson{counts.lessons === 1 ? "" : "s"} completed ·{" "}
          {counts.projects > 0 ? `${counts.projects} project${counts.projects === 1 ? "" : "s"} built · ` : ""}{progress.totals.runs} code runs
        </p>
      )}
      {lastLesson && (
        <button className="primary continue-btn" onClick={() => navigate({ view: "lesson", key: lastLesson })}>
          ▶ Continue: {lastLessonTitle ?? lastLesson}
        </button>
      )}
      <div className="track-grid">
        {data.tracks.map((t) => {
          const s = trackStats(t);
          return (
            <button key={t.id} className="track-card" onClick={() => navigate({ view: "track", trackId: t.id })}>
              <h2>{t.title}</h2>
              <p className="dim">{t.philosophy}</p>
              <ProgressBar done={s.done} total={s.authored} />
              <p className="dim small">
                {s.authored} lessons ready · {s.planned}+ planned
              </p>
            </button>
          );
        })}
      </div>
      {data.errors.length > 0 && (
        <div className="content-errors">
          <strong>Content problems:</strong>
          <ul>
            {data.errors.map((e, i) => (
              <li key={i}>
                <code>{e.file}</code>: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
