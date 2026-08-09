import { useEffect, useState } from "react";
import type { Tier } from "@teacher/shared";
import { api, type TrackView } from "../api/client";
import type { Route } from "../App";
import CustomLessonModal from "../components/CustomLessonModal";

// "custom" renders last — the learner's own generated lessons live below the
// authored syllabus.
const TIER_ORDER: Tier[] = ["foundations", "core", "intermediate", "advanced", "refresher", "custom"];
const TIER_LABEL: Record<Tier, string> = {
  foundations: "Foundations",
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
  refresher: "Refresher",
  custom: "Your custom lessons",
};

export default function Track({ trackId, navigate }: { trackId: string; navigate: (r: Route) => void }) {
  const [track, setTrack] = useState<TrackView | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    api
      .curriculum()
      .then((c) => setTrack(c.tracks.find((t) => t.id === trackId) ?? null))
      .catch(console.error);
  }, [trackId]);

  if (!track) return <div className="view-pad">Loading…</div>;

  return (
    <div className="view-pad track-view">
      <div className="track-head">
        <h1>{track.title}</h1>
        <button className="custom-lesson-btn" onClick={() => setCustomOpen(true)}>
          ✨ Custom lesson…
        </button>
      </div>
      <p className="dim">{track.philosophy}</p>
      {TIER_ORDER.map((tier) => {
        const units = track.units.filter((u) => u.tier === tier);
        if (units.length === 0) return null;
        return (
          <section key={tier}>
            <h2 className="tier-heading">{TIER_LABEL[tier]}</h2>
            {units.map((u) => (
              <details key={u.id} className="unit" open={!u.planned && u.lessons.length > 0}>
                <summary>
                  <span className="unit-title">{u.title}</span>
                  <span className="dim small"> — {u.summary}</span>
                  {u.planned && <span className="badge-planned">planned</span>}
                </summary>
                {u.lessons.length > 0 && (
                  <ul className="lesson-list">
                    {u.lessons.map((l) => (
                      <li key={l.key}>
                        <button className="lesson-row" onClick={() => navigate({ view: "lesson", key: l.key })}>
                          <span className={`check ${l.completedAt ? "done" : ""}`}>
                            {l.completedAt ? "✓" : "○"}
                          </span>
                          <span className="lesson-title">{l.title}</span>
                          <span className="dim small">~{l.estMinutes} min</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {(u.plannedLessons?.length ?? 0) > 0 && (
                  <ul className="lesson-list">
                    {u.plannedLessons!.map((id) => (
                      <li key={id} className="lesson-row ghost" aria-disabled="true">
                        <span className="check">·</span>
                        <span className="lesson-title dim">{id.replace(/^\d+-/, "").replaceAll("-", " ")}</span>
                        <span className="dim small">coming soon</span>
                      </li>
                    ))}
                  </ul>
                )}
                {u.planned && u.topics && (
                  <p className="dim small unit-topics">Will cover: {u.topics.join(" · ")}</p>
                )}
              </details>
            ))}
          </section>
        );
      })}
      {customOpen && (
        <CustomLessonModal
          trackId={track.id}
          trackTitle={track.title}
          onClose={() => setCustomOpen(false)}
          onAccepted={(key) => {
            setCustomOpen(false);
            navigate({ view: "lesson", key });
          }}
        />
      )}
    </div>
  );
}
