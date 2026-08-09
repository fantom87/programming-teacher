import { useEffect, useRef, useState } from "react";
import { api, type SnapshotMeta } from "../api/client";

interface Props {
  lessonKey: string;
  onRestore: (files: Record<string, string>) => void;
}

function formatTaken(iso: string): string {
  // Date + time — "3:41 PM" alone is useless three days later.
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryMenu({ lessonKey, onRestore }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SnapshotMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  async function toggle() {
    if (!open) {
      setError(null);
      setItems(await api.snapshots(lessonKey).catch(() => []));
    }
    setOpen(!open);
  }

  // Close on outside click and Escape while open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function restore(id: string) {
    try {
      const snap = await api.snapshot(lessonKey, id);
      onRestore(snap.files);
      setOpen(false);
    } catch (err) {
      setError(`Couldn't restore: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const lastPassing = items.find((s) => s.passed);

  return (
    <div className="history-menu" ref={rootRef}>
      <button aria-label="Code history" aria-haspopup="true" aria-expanded={open} onClick={toggle}>
        🕘 History
      </button>
      {open && (
        <div className="history-dropdown">
          {error && <div className="small history-error">{error}</div>}
          {items.length === 0 && <div className="dim small history-empty">No snapshots yet — they're saved on every Run.</div>}
          {lastPassing && (
            <button className="history-item history-restore-passing" onClick={() => restore(lastPassing.id)}>
              ↩ Restore last passing code
            </button>
          )}
          {items.map((s) => (
            <button key={s.id} className={`history-item ${s.passed ? "passing" : ""}`} onClick={() => restore(s.id)}>
              {formatTaken(s.takenAt)} · {s.trigger}
              {s.passed && <span className="history-passed"> · ✓ passing</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
