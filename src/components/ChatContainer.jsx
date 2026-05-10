// ─────────────────────────────────────────────────────────────────────────────
// ChatContainer.jsx  —  Full chat page: header, messages, input
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";
import Message from "./Message";
import InputBar from "./InputBar";

export default function ChatContainer({
  messages, chatInput, setChatInput,
  chatLoading, onSend, setView
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  return (
    <div className="chat-page fadein">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="header-dot" />
          <div>
            <div className="chat-header-title">Veda — Your Guide</div>
            <div className="chat-header-sub">Vedic wisdom for modern life</div>
          </div>
        </div>
        <button className="back-btn" onClick={() => setView("landing")}>← Home</button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 52, color: "var(--text-dim)" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, marginBottom: 10, color: "rgba(232,200,112,0.22)" }}>ॐ</div>
            <p style={{ fontSize: 14 }}>Ask anything — life, stress, purpose, relationships.</p>
            <p style={{ fontSize: 11.5, marginTop: 5 }}>Veda is here to listen and guide.</p>
          </div>
        )}
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputBar
        value={chatInput}
        onChange={setChatInput}
        onSend={onSend}
        loading={chatLoading}
      />
    </div>
  );
}
