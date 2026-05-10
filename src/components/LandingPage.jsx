// ─────────────────────────────────────────────────────────────────────────────
// LandingPage.jsx  —  Home page with daily shloka hero + feature cards
// ─────────────────────────────────────────────────────────────────────────────
import Mandala from "./Mandala";
import { SHLOKAS, STARTERS, FEATURES } from "../data/data";

export default function LandingPage({
  dailyIdx, setDailyIdx,
  setView, setSelectedShloka, askAboutShloka, startNewChat
}) {
  const todayShloka = SHLOKAS[dailyIdx % SHLOKAS.length];

  return (
    <div className="landing fadein">
      {/* ── Daily Shloka Hero ── */}
      <div className="daily-hero">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ animation: "slowSpin 42s linear infinite" }}>
            <Mandala size={70} />
          </div>
        </div>
        <div className="daily-label">✦ Shloka of the Day ✦</div>
        <div className="daily-shloka-text">{todayShloka.sanskrit}</div>
        <div className="daily-translation">{todayShloka.translation}</div>
        <div className="daily-source">— {todayShloka.source}</div>

        <div className="daily-nav">
          <button className="daily-arrow" onClick={() => setDailyIdx(i => (i - 1 + SHLOKAS.length) % SHLOKAS.length)}>‹</button>
          <div className="daily-dots">
            {SHLOKAS.map((_, i) => (
              <div key={i} className={`daily-dot ${i === dailyIdx ? "on" : ""}`} onClick={() => setDailyIdx(i)} />
            ))}
          </div>
          <button className="daily-arrow" onClick={() => setDailyIdx(i => (i + 1) % SHLOKAS.length)}>›</button>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          <button className="starter-btn" style={{ fontSize: 11.5 }} onClick={() => setSelectedShloka(todayShloka)}>
            📖 Read in full
          </button>
          <button className="starter-btn" style={{ fontSize: 11.5 }} onClick={() => askAboutShloka(todayShloka)}>
            💬 Ask Veda about this
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="landing-body">
        <div className="section-eyebrow">Explore VedaSphere</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 300, color: "var(--paper)", marginBottom: 8, lineHeight: 1.1 }}>
          Wisdom for the <em style={{ fontStyle: "italic", color: "var(--ashgold)" }}>modern soul</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-mid)", maxWidth: 490, lineHeight: 1.7, marginBottom: 26, fontWeight: 300 }}>
          Five thousand years of Vedic philosophy — made practical, personal, and alive for everyday modern challenges.
        </p>

        {/* Feature Cards */}
        <div className="features-grid">
          <div className="feature-card" onClick={() => setView("wisdom")} role="button">
            <span className="feature-icon">📖</span>
            <div className="feature-title">Vedic Wisdom</div>
            <div className="feature-desc">Explore the Gita, Upanishads, Rigveda & more — with modern context</div>
            <div className="feature-cta">Explore texts →</div>
          </div>
          <div className="feature-card" onClick={() => setView("guidance")} role="button">
            <span className="feature-icon">🧘</span>
            <div className="feature-title">Personal Guidance</div>
            <div className="feature-desc">Choose your life challenge and receive tailored Vedic guidance instantly</div>
            <div className="feature-cta">Get guidance →</div>
          </div>
          <div className="feature-card" onClick={() => setView("library")} role="button">
            <span className="feature-icon">🪷</span>
            <div className="feature-title">Shloka Library</div>
            <div className="feature-desc">Browse, save & meditate on 205 curated sacred verses with meanings</div>
            <div className="feature-cta">Browse shlokas →</div>
          </div>
        </div>

        <div className="section-eyebrow" style={{ marginBottom: 12 }}>Ask Veda directly</div>
        <div className="starters-row">
          {STARTERS.map((s, i) => (
            <button key={i} className="starter-btn" onClick={() => startNewChat(s.text)}>
              <span>{s.icon}</span>{s.text}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button className="begin-btn" onClick={() => startNewChat()}>Begin your journey →</button>
          <button className="ghost-btn" onClick={() => setView("library")}>Browse Shloka Library</button>
        </div>
      </div>
    </div>
  );
}
