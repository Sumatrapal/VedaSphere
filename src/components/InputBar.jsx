// ─────────────────────────────────────────────────────────────────────────────
// InputBar.jsx  —  Chat text input with send button
// ─────────────────────────────────────────────────────────────────────────────
import { useRef } from "react";

export default function InputBar({ value, onChange, onSend, loading }) {
  const textareaRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
  };

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          className="input-field"
          placeholder="Ask Veda about life, stress, purpose…"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          onInput={handleInput}
          rows={1}
          disabled={loading}
          autoFocus
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={!value.trim() || loading}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
      <div className="input-hint">Enter to send · Shift+Enter for new line</div>
    </div>
  );
}
