import { useEffect, useState } from "react";
import { api, type CurriculumResponse, type TrackView } from "../api/client";
import ProgressBar from "../components/ProgressBar";
import type { Route } from "../App";

function trackStats(track: TrackView) {
  let done = 0;
  let authored = 0;
  let planned = 0;
  for (const u of track.units) {
    authored += u.lessons.length;
    planned += u.plannedLessons?.length ?? 0;
    if (u.planned && u.topics) planned += u.topics.length; // rough size of unauthored units
    done += u.lessons.filter((l) => l.completedAt).length;
  }
  return { done, authored, planned };
}

export default function Home({ navigate }: { navigate: (r: Route) => void }) {
  const [data, setData] = useState<CurriculumResponse | null>(null);
  const lastLesson = localStorage.getItem("lastLessonKey");
  const lastLessonTitle = localStorage.getItem("lastLessonTitle");

  useEffect(() => {
    api.curriculum().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="view-pad">Loading…</div>;

  return (
    <div className="view-pad home">
      <h1>Welcome back</h1>
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
