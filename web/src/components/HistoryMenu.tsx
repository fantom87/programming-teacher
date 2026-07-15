import { useState } from "react";
import { api, type SnapshotMeta } from "../api/client";

interface Props {
  lessonKey: string;
  onRestore: (files: Record<string, string>) => void;
}

export default function HistoryMenu({ lessonKey, onRestore }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SnapshotMeta[]>([]);

  async function toggle() {
    if (!open) setItems(await api.snapshots(lessonKey).catch(() => []));
    setOpen(!open);
  }

  async function restore(id: string) {
    const snap = await api.snapshot(lessonKey, id);
    onRestore(snap.files);
    setOpen(false);
  }

  return (
    <div className="history-menu">
      <button aria-label="Code history" aria-expanded={open} onClick={toggle}>
        🕘 History
      </button>
      {open && (
        <div className="history-dropdown">
          {items.length === 0 && <div className="dim small history-empty">No snapshots yet — they're saved on every Run.</div>}
          {items.map((s) => (
            <button key={s.id} className="history-item" onClick={() => restore(s.id)}>
              {new Date(s.takenAt).toLocaleTimeString()} · {s.trigger}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
