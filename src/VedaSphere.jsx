// ─────────────────────────────────────────────────────────────────────────────
// VedaSphere.jsx  —  Central layout manager & state controller
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";

// Styles
import "./styles/VedaSphere.css";

// Hooks & utilities
import { streamAI, uid, getDailyIdx } from "./hooks/useStreamAI";

// Data
import { SHLOKAS, SYSTEM_PROMPT } from "./data/data";

// Layout components
import Sidebar          from "./components/Sidebar";
import ApiKeyBanner     from "./components/ApiKeyBanner";

// Page components
import LandingPage          from "./components/LandingPage";
import VedicWisdomPage      from "./components/VedicWisdomPage";
import PersonalGuidancePage from "./components/PersonalGuidancePage";
import ShlokaLibraryPage    from "./components/ShlokaLibraryPage";
import ChatContainer        from "./components/ChatContainer";

// Modals
import ShlokaModal from "./components/ShlokaModal";

// ─────────────────────────────────────────────────────────────────────────────
export default function VedaSphere() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [view, setView] = useState("landing");

  // ── API Key ─────────────────────────────────────────────────────────────────
  const [apiKey, setApiKey] = useState(() => {
    try { return window.__vsApiKey || ""; } catch { return ""; }
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  // ── Chat state ───────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId]   = useState(null);
  const [chatInput, setChatInput]         = useState("");
  const [chatLoading, setChatLoading]     = useState(false);

  // ── Shloka & library state ──────────────────────────────────────────────────
  const [dailyIdx, setDailyIdx]           = useState(() => getDailyIdx(SHLOKAS.length));
  const [favorites, setFavorites]         = useState(new Set());
  const [shlokaModal, setShlokaModal]     = useState(null);  // global shloka modal

  // ── Toast ────────────────────────────────────────────────────────────────────
  const [toast, setToast]   = useState("");
  const [toastKey, setToastKey] = useState(0);

  // ── Inject global CSS keyframes not handled by the CSS file ─────────────────
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `@keyframes slowSpin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setToastKey(k => k + 1);
    setTimeout(() => setToast(""), 2000);
  };

  const updateConv = useCallback((id, fn) => {
    setConversations(prev => prev.map(c => c.id === id ? fn(c) : c));
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Removed from saved"); }
      else              { next.add(id);    showToast("Saved to favourites ♥"); }
      return next;
    });
  }, []);

  // ── Send chat message with streaming ────────────────────────────────────────
  const sendChatMessage = useCallback(async (convId, prevMsgs, text) => {
    if (!text.trim() || chatLoading) return;
    setChatInput("");

    const userMsg = { id: uid(), role: "user",      content: text.trim() };
    const aiId    = uid();
    const aiMsg   = { id: aiId,  role: "assistant", content: "", streaming: true };

    updateConv(convId, c => ({
      ...c,
      title: c.messages.length === 0
        ? text.slice(0, 38) + (text.length > 38 ? "…" : "")
        : c.title,
      messages: [...c.messages, userMsg, aiMsg],
    }));
    setChatLoading(true);

    const history = [
      ...prevMsgs.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: text.trim() },
    ];

    await streamAI(
      history,
      SYSTEM_PROMPT,
      acc => updateConv(convId, c => ({
        ...c,
        messages: c.messages.map(m => m.id === aiId ? { ...m, content: acc } : m),
      })),
      () => {
        updateConv(convId, c => ({
          ...c,
          messages: c.messages.map(m => m.id === aiId ? { ...m, streaming: false } : m),
        }));
        setChatLoading(false);
      },
      (err) => {
        const errMsg = err?.message?.includes("No valid API key")
          ? "⚠ Please add your Anthropic API key using the banner above."
          : "I encountered a moment of stillness — please try again.";
        updateConv(convId, c => ({
          ...c,
          messages: c.messages.map(m => m.id === aiId ? { ...m, content: errMsg, streaming: false } : m),
        }));
        setChatLoading(false);
      },
      apiKey
    );
  }, [chatLoading, updateConv, apiKey]);

  // ── Start a new conversation ─────────────────────────────────────────────────
  const startNewChat = useCallback((initMsg = null) => {
    const id = uid();
    setConversations(prev => [{
      id,
      title: initMsg
        ? initMsg.slice(0, 38) + (initMsg.length > 38 ? "…" : "")
        : "New conversation",
      messages: [],
    }, ...prev]);
    setActiveConvId(id);
    setView("chat");
    if (initMsg) setTimeout(() => sendChatMessage(id, [], initMsg), 60);
  }, [sendChatMessage]);

  // ── Chat send handler ────────────────────────────────────────────────────────
  const handleChatSend = useCallback(() => {
    if (!chatInput.trim() || chatLoading) return;
    if (view !== "chat" || !activeConvId) {
      startNewChat(chatInput.trim());
      setChatInput("");
    } else {
      const msgs = conversations.find(c => c.id === activeConvId)?.messages || [];
      sendChatMessage(activeConvId, msgs, chatInput.trim());
    }
  }, [chatInput, chatLoading, view, activeConvId, conversations, startNewChat, sendChatMessage]);

  // ── Ask about a shloka ───────────────────────────────────────────────────────
  const askAboutShloka = useCallback((shloka) => {
    setShlokaModal(null);
    startNewChat(
      `I've been meditating on this verse: "${shloka.translation}" (${shloka.source}). ` +
      `How can I apply this in my daily life today?`
    );
  }, [startNewChat]);

  // ── Active conversation messages ─────────────────────────────────────────────
  const messages = conversations.find(c => c.id === activeConvId)?.messages || [];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="app grain">
      {/* Sidebar */}
      <Sidebar
        view={view}
        setView={setView}
        conversations={conversations}
        activeConvId={activeConvId}
        setActiveConvId={setActiveConvId}
        startNewChat={startNewChat}
      />

      {/* Main content */}
      <main className="main">
        {/* API key banner — always visible */}
        <ApiKeyBanner
          apiKey={apiKey}
          setApiKey={setApiKey}
          showKeyInput={showKeyInput}
          setShowKeyInput={setShowKeyInput}
        />

        {/* Pages */}
        {view === "landing" && (
          <LandingPage
            dailyIdx={dailyIdx}
            setDailyIdx={setDailyIdx}
            setView={setView}
            setSelectedShloka={setShlokaModal}
            askAboutShloka={askAboutShloka}
            startNewChat={startNewChat}
          />
        )}

        {view === "wisdom" && (
          <VedicWisdomPage
            setView={setView}
            startNewChat={startNewChat}
          />
        )}

        {view === "guidance" && (
          <PersonalGuidancePage
            setView={setView}
            startNewChat={startNewChat}
            apiKey={apiKey}
          />
        )}

        {view === "library" && (
          <ShlokaLibraryPage
            setView={setView}
            favorites={favorites}
            toggleFav={toggleFav}
            askAboutShloka={askAboutShloka}
          />
        )}

        {view === "chat" && (
          <ChatContainer
            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            chatLoading={chatLoading}
            onSend={handleChatSend}
            setView={setView}
          />
        )}
      </main>

      {/* Global shloka modal */}
      {shlokaModal && (
        <ShlokaModal
          shloka={shlokaModal}
          onClose={() => setShlokaModal(null)}
          onAsk={askAboutShloka}
          onFav={toggleFav}
          isFav={favorites.has(shlokaModal.id)}
        />
      )}

      {/* Toast */}
      {toast && <div key={toastKey} className="toast">{toast}</div>}
    </div>
  );
}
