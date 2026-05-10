// ─────────────────────────────────────────────────────────────────────────────
// VedicWisdomPage.jsx  —  Browse 6 foundational Vedic texts
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { VEDIC_WISDOM } from "../data/data";
import WisdomModal from "./WisdomModal";

export default function VedicWisdomPage({ setView, startNewChat }) {
  const [wisdomTab, setWisdomTab] = useState("All");
  const [wisdomModal, setWisdomModal] = useState(null);

  const filtered = wisdomTab === "All"
    ? VEDIC_WISDOM
    : VEDIC_WISDOM.filter(w =>
        w.concepts.some(c => c.toLowerCase().includes(wisdomTab.toLowerCase())) ||
        w.title.toLowerCase().includes(wisdomTab.toLowerCase())
      );

  const handleAsk = (msg) => {
    setWisdomModal(null);
    startNewChat(msg);
  };

  return (
    <div className="wisdom-page fadein">
      <div className="page-header">
        <div>
          <div className="page-header-title">📖 Vedic Wisdom</div>
          <div className="page-header-sub">6 foundational texts · Click any card to explore in depth</div>
        </div>
        <button className="back-btn" onClick={() => setView("landing")}>← Home</button>
      </div>

      <div className="wisdom-body">
        <div className="wisdom-intro">
          <div className="wisdom-intro-icon">🕯️</div>
          <div className="wisdom-intro-text">
            The Vedic tradition is not a single book but a vast ocean of knowledge spanning{" "}
            <strong>3,000+ years</strong>. Each text represents a different lens — philosophy,
            action, cosmology, and governance — all pointing toward the same truth:{" "}
            <strong>a life of clarity, purpose, and inner peace</strong>. Click any text to
            explore its core principles and how they apply today.
          </div>
        </div>

        <div className="wisdom-tabs">
          {["All", "Philosophy", "Action", "Cosmology", "Governance", "Mind"].map(t => (
            <button key={t} className={`wisdom-tab ${wisdomTab === t ? "active" : ""}`} onClick={() => setWisdomTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="wisdom-grid">
          {filtered.map(w => (
            <div key={w.id} className="wisdom-card" onClick={() => setWisdomModal(w)}>
              <div className="wisdom-card-era">{w.era}</div>
              <div className="wisdom-card-title">{w.title}</div>
              <div className="wisdom-card-desc" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
                {w.subtitle}
              </div>
              <div className="wisdom-card-desc">{w.desc.slice(0, 120)}…</div>
              <div className="wisdom-card-concepts">
                {w.concepts.slice(0, 3).map((c, i) => <span key={i} className="wisdom-concept">{c}</span>)}
              </div>
              <div className="wisdom-card-footer">
                <div className="wisdom-card-source">{w.era}</div>
                <button className="wisdom-explore-btn" onClick={e => { e.stopPropagation(); setWisdomModal(w); }}>
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {wisdomModal && (
        <WisdomModal item={wisdomModal} onClose={() => setWisdomModal(null)} onAsk={handleAsk} />
      )}
    </div>
  );
}
