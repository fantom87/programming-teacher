import { useEffect, useState } from "react";
import { api, tutorAvailability, type TutorState } from "./client";

/** Whether the AI tutor can be reached, and why not when it can't.
 *  `available` stays undefined until /api/health answers (and while the
 *  server is still self-testing), so panes render optimistically instead of
 *  flashing their offline copy on every load. */
export function useTutorStatus(): { available: boolean | undefined; state: TutorState } {
  const [status, setStatus] = useState<{ available: boolean | undefined; state: TutorState }>({
    available: undefined,
    state: "unknown",
  });

  useEffect(() => {
    let live = true;
    api
      .health()
      .then((h) => {
        if (live) setStatus(tutorAvailability(h));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return status;
}
