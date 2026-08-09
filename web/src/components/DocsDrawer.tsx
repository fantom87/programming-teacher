import { useEffect, useRef } from "react";
import Docs from "../views/Docs";

interface Props {
  open: boolean;
  initial: string | null;
  onClose: () => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function DocsDrawer({ open, initial, onClose }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Dialog pattern: move focus to the search input on open, give it back to
  // the opener on close.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      panelRef.current?.querySelector<HTMLElement>("input")?.focus();
    } else if (openerRef.current) {
      openerRef.current.focus();
      openerRef.current = null;
    }
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    // Trap Tab inside the drawer while it's open.
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Stay mounted while closed (visibility: hidden) so the Docs page, search
  // text, and scroll position survive quick open/close toggles.
  return (
    <div className={`drawer-backdrop ${open ? "" : "drawer-closed"}`} onClick={onClose} onKeyDown={onKeyDown}>
      <aside
        className="docs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Documentation"
        ref={panelRef}
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
