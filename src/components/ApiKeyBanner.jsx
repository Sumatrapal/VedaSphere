// ─────────────────────────────────────────────────────────────────────────────
// ApiKeyBanner.jsx  —  API key input shown at top of every page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";

export default function ApiKeyBanner({ apiKey, setApiKey, showKeyInput, setShowKeyInput }) {
  const [draft, setDraft] = useState(apiKey);

  const save = () => {
    const trimmed = draft.trim();
    setApiKey(trimmed);
    try { window.__vsApiKey = trimmed; } catch { /* noop */ }
    setShowKeyInput(false);
  };

  return (
    <div className="key-banner">
      <span className="key-banner-label">🔑 Anthropic API Key</span>

      {!showKeyInput ? (
        <>
          {apiKey
            ? (
              <>
                <div className="key-set-indicator">
                  <div className="key-set-dot" />
                  <span>Key set — chat is live</span>
                </div>
                <button className="key-toggle-btn" onClick={() => { setDraft(apiKey); setShowKeyInput(true); }}>
                  Change
                </button>
              </>
            ) : (
              <>
                <span className="key-banner-sub">Required to use the AI chat</span>
                <button className="key-save-btn" onClick={() => setShowKeyInput(true)}>Add Key</button>
              </>
            )
          }
        </>
      ) : (
        <>
          <input
            className="key-input"
            type="password"
            placeholder="sk-ant-api03-..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && save()}
            autoFocus
          />
          <button className="key-save-btn" onClick={save}>Save</button>
          {apiKey && (
            <button className="key-toggle-btn" onClick={() => setShowKeyInput(false)}>Cancel</button>
          )}
        </>
      )}
    </div>
  );
}
