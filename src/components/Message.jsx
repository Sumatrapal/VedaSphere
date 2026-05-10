// ─────────────────────────────────────────────────────────────────────────────
// Message.jsx  —  Individual chat message bubble (user or AI)
// ─────────────────────────────────────────────────────────────────────────────
import { parseVedaResponse } from "../hooks/useStreamAI";

function BubbleContent({ text, streaming }) {
  const parts = parseVedaResponse(text);
  return (
    <>
      {parts.map((p, i) =>
        p.type === "shloka"
          ? <div key={i} className="inline-shloka">{p.content}</div>
          : <span key={i} style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>
      )}
      {streaming && <span className="cursor" />}
    </>
  );
}

function ThinkingDots() {
  return (
    <div className="thinking">
      <div className="thinking-dot" />
      <div className="thinking-dot" />
      <div className="thinking-dot" />
    </div>
  );
}

export default function Message({ msg }) {
  const isAI = msg.role === "assistant";
  return (
    <div className={`message ${msg.role}`}>
      {isAI ? (
        <>
          <div className="avatar avatar-ai">व</div>
          <div className="bubble bubble-ai">
            <div className="bubble-label ai">Veda</div>
            {msg.content === "" && msg.streaming
              ? <ThinkingDots />
              : <BubbleContent text={msg.content} streaming={msg.streaming} />
            }
          </div>
        </>
      ) : (
        <>
          <div className="avatar avatar-user">🙏</div>
          <div className="bubble bubble-user">
            <div className="bubble-label">You</div>
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
          </div>
        </>
      )}
    </div>
  );
}
