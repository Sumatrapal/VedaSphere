// ─────────────────────────────────────────────────────────────────────────────
// PersonalGuidancePage.jsx  —  Topic selector + AI guidance form
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { GUIDANCE_TOPICS, GUIDANCE_SYSTEM } from "../data/data";
import { streamAI } from "../hooks/useStreamAI";
import { parseVedaResponse } from "../hooks/useStreamAI";

function GuidanceResponse({ text, streaming, loading }) {
  const parts = parseVedaResponse(text);
  return (
    <div className="guidance-response">
      <div className="guidance-response-header">
        <div className="guidance-response-avatar">व</div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "var(--paper)" }}>Veda</div>
          <div className="guidance-response-name">Vedic Guide</div>
        </div>
      </div>
      {loading && !text ? (
        <div className="thinking">
          <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
        </div>
      ) : (
        <div className="guidance-response-text">
          {parts.map((p, i) =>
            p.type === "shloka"
              ? <div key={i} className="inline-shloka">{p.content}</div>
              : <span key={i} style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>
          )}
          {streaming && <span className="cursor" />}
        </div>
      )}
    </div>
  );
}

export default function PersonalGuidancePage({ setView, startNewChat, apiKey }) {
  const [guidanceTopic, setGuidanceTopic] = useState(null);
  const [guidanceInput, setGuidanceInput] = useState("");
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [guidanceResp, setGuidanceResp] = useState("");
  const [guidanceStreaming, setGuidanceStreaming] = useState(false);

  const selTopic = GUIDANCE_TOPICS.find(t => t.id === guidanceTopic);

  const submitGuidance = async () => {
    if (!guidanceInput.trim() || guidanceLoading) return;
    setGuidanceLoading(true);
    setGuidanceResp("");
    setGuidanceStreaming(true);
    const topic = selTopic?.title || "General Life Guidance";
    const userMsg = `Topic: ${topic}\n\nMy situation: ${guidanceInput.trim()}`;
    await streamAI(
      [{ role: "user", content: userMsg }],
      GUIDANCE_SYSTEM,
      acc => setGuidanceResp(acc),
      () => { setGuidanceLoading(false); setGuidanceStreaming(false); },
      () => { setGuidanceResp("I encountered a moment of stillness — please try again."); setGuidanceLoading(false); setGuidanceStreaming(false); },
      apiKey
    );
  };

  return (
    <div className="guidance-page fadein">
      <div className="page-header">
        <div>
          <div className="page-header-title">🧘 Personal Guidance</div>
          <div className="page-header-sub">Choose your challenge, share your situation, receive Vedic wisdom</div>
        </div>
        <button className="back-btn" onClick={() => setView("landing")}>← Home</button>
      </div>

      <div className="guidance-body">
        <div className="section-eyebrow" style={{ marginBottom: 14 }}>What are you navigating?</div>
        <div className="guidance-topics">
          {GUIDANCE_TOPICS.map(t => (
            <div
              key={t.id}
              className={`guidance-topic-card ${guidanceTopic === t.id ? "selected" : ""}`}
              onClick={() => { setGuidanceTopic(t.id); setGuidanceResp(""); setGuidanceInput(""); }}
            >
              <span className="guidance-topic-icon">{t.icon}</span>
              <div className="guidance-topic-title">{t.title}</div>
              <div className="guidance-topic-desc">{t.desc}</div>
            </div>
          ))}
        </div>

        <div className="guidance-form-area">
          <div className="guidance-form-title">
            {selTopic ? `${selTopic.icon} ${selTopic.title}` : "Share your situation"}
          </div>
          <div className="guidance-form-sub">
            {selTopic
              ? `Tell Veda more about what you're experiencing with ${selTopic.title.toLowerCase()}.`
              : "Select a topic above, or describe your situation directly. Veda will respond with Vedic wisdom tailored to you."}
          </div>

          {selTopic && (
            <div className="guidance-prompts">
              {selTopic.prompts.map((p, i) => (
                <button key={i} className="guidance-prompt-btn" onClick={() => setGuidanceInput(p)}>{p}</button>
              ))}
            </div>
          )}

          <textarea
            className="guidance-textarea"
            rows={4}
            placeholder={selTopic
              ? `Describe your ${selTopic.title.toLowerCase()} situation in your own words…`
              : "Describe what you're going through…"}
            value={guidanceInput}
            onChange={e => setGuidanceInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) { e.preventDefault(); submitGuidance(); } }}
          />

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button
              className="guidance-submit"
              onClick={submitGuidance}
              disabled={!guidanceInput.trim() || guidanceLoading}
            >
              {guidanceLoading ? "Seeking wisdom…" : "✦ Receive Vedic Guidance"}
            </button>
            {guidanceResp && (
              <button className="ghost-btn" style={{ padding: "10px 18px", fontSize: 12 }}
                onClick={() => startNewChat(guidanceInput)}>
                Continue in Chat →
              </button>
            )}
          </div>

          {(guidanceLoading || guidanceResp) && (
            <GuidanceResponse text={guidanceResp} streaming={guidanceStreaming} loading={guidanceLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
