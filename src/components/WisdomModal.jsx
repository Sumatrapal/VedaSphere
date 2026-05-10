// ─────────────────────────────────────────────────────────────────────────────
// WisdomModal.jsx  —  Deep-dive modal for a Vedic text entry
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";

export default function WisdomModal({ item, onClose, onAsk }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-era">{item.era}</div>
        <div className="modal-title">{item.title}</div>
        <div className="modal-subtitle">{item.subtitle}</div>
        <div className="modal-divider" />

        <div className="modal-section-label">Overview</div>
        <div className="modal-body-text">{item.desc}</div>
        <div className="modal-highlight">{item.highlight}</div>

        <div className="modal-section-label">Core Principles for Modern Life</div>
        <div className="modal-principles">
          {item.principles.map((p, i) => (
            <div key={i} className="modal-principle">
              <div className="modal-principle-num">{i + 1}</div>
              <div className="modal-principle-text">
                <strong>{p.h} — </strong>{p.t}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-section-label">Key Concepts</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {item.concepts.map((c, i) => (
            <span key={i} style={{
              fontSize: 10.5, background: "rgba(232,200,112,0.08)",
              border: "1px solid rgba(232,200,112,0.18)", borderRadius: 10,
              padding: "3px 10px", color: "var(--ashgold)"
            }}>{c}</span>
          ))}
        </div>

        <div className="modal-actions-row">
          <button className="modal-action primary"
            onClick={() => onAsk(`I want to understand the ${item.title} and how to apply its wisdom in my daily modern life.`)}>
            💬 Discuss with Veda
          </button>
          <button className="modal-action" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
