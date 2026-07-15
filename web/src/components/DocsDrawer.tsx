import Docs from "../views/Docs";

interface Props {
  open: boolean;
  initial: string | null;
  onClose: () => void;
}

export default function DocsDrawer({ open, initial, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="docs-drawer"
        role="dialog"
        aria-label="Documentation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <strong>Documentation</strong>
          <button aria-label="Close documentation" onClick={onClose}>
            ✕
          </button>
        </div>
        <Docs initial={initial} compact />
      </aside>
    </div>
  );
}
