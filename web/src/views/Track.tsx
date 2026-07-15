import { useEffect, useState } from "react";
import type { Tier } from "@teacher/shared";
import { api, type TrackView } from "../api/client";
import type { Route } from "../App";

const TIER_ORDER: Tier[] = ["foundations", "core", "intermediate", "advanced", "refresher"];
const TIER_LABEL: Record<Tier, string> = {
  foundations: "Foundations",
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
  refresher: "Refresher",
};

export default function Track({ trackId, navigate }: { trackId: string; navigate: (r: Route) => void }) {
  const [track, setTrack] = useState<TrackView | null>(null);

  useEffect(() => {
    api
      .curriculum()
      .then((c) => setTrack(c.tracks.find((t) => t.id === trackId) ?? null))
      .catch(console.error);
  }, [trackId]);

  if (!track) return <div className="view-pad">Loading…</div>;

  return (
    <div className="view-pad track-view">
      <h1>{track.title}</h1>
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
    </div>
  );
}
