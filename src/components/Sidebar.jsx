// ─────────────────────────────────────────────────────────────────────────────
// Sidebar.jsx  —  Navigation sidebar with logo, nav links, chat history
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar({ view, setView, conversations, activeConvId, setActiveConvId, startNewChat }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => setView("landing")}>
        <div className="logo-eyebrow">ॐ  VedaSphere</div>
        <div className="logo-name">VedaSphere</div>
        <div className="logo-tag">Ancient wisdom · Modern life</div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <button className={`nav-btn ${view === "landing" ? "active" : ""}`} onClick={() => setView("landing")}>
          <span className="nav-icon">🏠</span> Home
        </button>
        <button className={`nav-btn ${view === "wisdom" ? "active" : ""}`} onClick={() => setView("wisdom")}>
          <span className="nav-icon">📖</span> Vedic Wisdom
        </button>
        <button className={`nav-btn ${view === "guidance" ? "active" : ""}`}
          onClick={() => setView("guidance")}>
          <span className="nav-icon">🧘</span> Personal Guidance
        </button>
        <button className={`nav-btn ${view === "library" ? "active" : ""}`} onClick={() => setView("library")}>
          <span className="nav-icon">📜</span> Shloka Library
        </button>
      </div>

      {/* New chat */}
      <button className="new-chat-btn" onClick={() => startNewChat()}>
        <span>＋</span> New Conversation
      </button>

      {/* Recent chats */}
      {conversations.length > 0 && (
        <>
          <div className="sidebar-section-label">Recent chats</div>
          <div className="chat-list">
            {conversations.map(c => (
              <div
                key={c.id}
                className={`chat-item ${c.id === activeConvId && view === "chat" ? "active" : ""}`}
                onClick={() => { setActiveConvId(c.id); setView("chat"); }}
              >
                <span style={{ fontSize: 11, opacity: 0.5 }}>🪷</span>
                <span className="chat-item-text">{c.title}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="sidebar-footer">
        <strong>VedaSphere</strong> draws from the Rigveda, Upanishads & Bhagavad Gita — not a replacement for professional guidance.
      </div>
    </aside>
  );
}
