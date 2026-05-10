// ─────────────────────────────────────────────────────────────────────────────
// useStreamAI.js  —  Core streaming API hook for VedaSphere
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Streams a response from the Anthropic API.
 * Requires an API key passed directly (for browser usage with
 * anthropic-dangerous-direct-browser-access header).
 *
 * @param {Array}    messages      - Conversation history [{role, content}]
 * @param {string}   systemPrompt  - System instruction for Veda's personality
 * @param {function} onChunk       - Called with accumulated text on every chunk
 * @param {function} onDone        - Called with final text when stream ends
 * @param {function} onError       - Called with error on failure
 * @param {string}   apiKey        - Anthropic API key (sk-ant-...)
 */
export async function streamAI(messages, systemPrompt, onChunk, onDone, onError, apiKey) {
  if (!apiKey || !apiKey.startsWith("sk-")) {
    onError(new Error("No valid API key provided"));
    return;
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.text) {
            accumulated += parsed.delta.text;
            onChunk(accumulated);
          }
        } catch { /* skip malformed SSE lines */ }
      }
    }
    onDone(accumulated);
  } catch (e) {
    onError(e);
  }
}

/**
 * Parse Veda's response to extract [SHLOKA]...[/SHLOKA] blocks
 * Returns array of {type: 'text'|'shloka', content: string}
 */
export function parseVedaResponse(text) {
  const parts = [];
  const re = /\[SHLOKA\]([\s\S]*?)\[\/SHLOKA\]/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "shloka", content: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

/** Unique ID generator */
let _id = 0;
export const uid = () => `${++_id}-${Date.now()}`;

/** Get today's shloka index based on date */
export function getDailyIdx(total) {
  const diff = Math.floor((new Date() - new Date("2024-01-01")) / 86400000);
  return diff % total;
}
