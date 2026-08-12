import type { TrackView } from "./api/client";

export interface CompletionCounts {
  lessons: number;
  projects: number;
  /** projects with at least one stage done but not all of them */
  projectsStarted: number;
}

/**
 * Counted from the curriculum, never from raw progress keys.
 *
 * Every stage of a project gets its own entry in `progress.lessons`, so
 * `Object.values(progress.lessons).filter(completed).length` would report an
 * 8-stage project as "8 lessons completed". The curriculum is the only thing
 * that knows which keys are lessons and which are stages — which is also why
 * this doesn't sniff key shapes.
 */
export function completionCounts(tracks: TrackView[]): CompletionCounts {
  let lessons = 0;
  let projects = 0;
  let projectsStarted = 0;
  for (const track of tracks) {
    for (const unit of track.units) {
      lessons += unit.lessons.filter((l) => l.completedAt).length;
      for (const p of unit.projects ?? []) {
        if (p.completedAt) projects++;
        else if (p.stagesDone > 0) projectsStarted++;
      }
    }
  }
  return { lessons, projects, projectsStarted };
}
