// ─────────────────────────────────────────────────────────────────────────────
// ShlokaModal.jsx  —  Full-detail modal for a single shloka
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";

export default function ShlokaModal({ shloka, onClose, onAsk, onFav, isFav }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="shloka-modal-tag">{shloka.category}</div>
        <div className="shloka-modal-symbol">ॐ</div>
        <div className="shloka-modal-sanskrit">{shloka.sanskrit}</div>
        <div className="modal-divider" />

        <div className="modal-section-label">Translation</div>
        <div className="modal-body-text">{shloka.translation}</div>

        <div className="modal-section-label">Meaning for Today</div>
        <div className="modal-body-text">{shloka.meaning}</div>

        <div className="modal-actions-row" style={{ justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 13, color: "var(--text-dim)" }}>
            — {shloka.source}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="modal-action" onClick={() => onFav(shloka.id)}>
              {isFav ? "♥ Saved" : "♡ Save"}
            </button>
            <button className="modal-action primary" onClick={() => onAsk(shloka)}>
              💬 Ask Veda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
