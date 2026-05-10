#  VedaSphere

**Ancient wisdom · Modern life** — An AI-powered Vedic guidance platform built with React + Vite.

##  Live Demo
https://vedasphere.vercel.app/

##  Status
VedaSphere is currently under active development.

Current version includes:
- AI-powered spiritual guidance
- Daily wisdom experience
- 205+ shlokas
- Vedic text exploration
- Streaming chat interface
- Modular React architecture

AI features currently require a valid Anthropic API key.

---

## Tech Stack

- React 18
- Vite 5
- JavaScript (ES6+)
- CSS3
- Anthropic Claude API
- Vercel

---

## Project Structure

```
vedasphere/
├── index.html                    # App entry HTML
├── vite.config.js                # Vite configuration
├── package.json
├── .env.local                    # API key (git-ignored)
└── src/
    ├── main.jsx                  # React root
    ├── VedaSphere.jsx            # ← Central layout & state controller
    │
    ├── styles/
    │   └── VedaSphere.css        # All styles (design tokens, components)
    │
    ├── data/
    │   └── data.js               # 205 shlokas, Vedic texts, prompts, constants
    │
    ├── hooks/
    │   └── useStreamAI.js        # streamAI(), parseVedaResponse(), uid(), getDailyIdx()
    │
    └── components/
        ├── ApiKeyBanner.jsx      # API key input banner
        ├── Sidebar.jsx           # Navigation sidebar
        ├── Mandala.jsx           # Animated SVG mandala
        ├── Message.jsx           # Chat bubble (user + AI)
        ├── InputBar.jsx          # Chat text input
        ├── ChatContainer.jsx     # Full chat page
        ├── LandingPage.jsx       # Home page + daily shloka
        ├── VedicWisdomPage.jsx   # Browse 6 foundational texts
        ├── PersonalGuidancePage.jsx  # Topic selector + AI guidance
        ├── ShlokaLibraryPage.jsx # 205 shlokas with search/filter
        ├── WisdomModal.jsx       # Vedic text detail modal
        └── ShlokaModal.jsx       # Shloka detail modal
```
## Features

| Feature | Description |
|---------|-------------|
|  Landing | Daily shloka hero with carousel, feature cards, quick-start prompts |
|  Vedic Wisdom | 6 foundational texts (Gita, Upanishads, Rigveda, Yoga Sutras, Arthashastra, Puranas) |
|  Personal Guidance | 6 life topics → AI guidance streamed in real-time |
|  Shloka Library | 205 shlokas, 39 categories, full-text search, favourites |
|  Chat | Streaming AI chat with shloka rendering, multi-conversation history |
|  API Key | Secure in-app key input with live status indicator |

```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
npm run preview
```

## Making AI Chat Work

The app calls Anthropic's API directly from the browser using the
`anthropic-dangerous-direct-browser-access` header.

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Click **Add Key** in the orange banner at the top of the app
3. Paste your `sk-ant-...` key and click Save
4. The dot turns green — chat is live 

### For Production (Recommended)

Move the API call to a server-side route to keep the key secret:

```js
// src/api/chat/route.js (Next.js App Router)
export async function POST(req) {
  const { messages, system } = await req.json();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system, messages, stream: true }),
  });
  return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
}
```

Then update `useStreamAI.js` to call `/api/chat` instead of Anthropic directly.

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Set `ANTHROPIC_API_KEY` in Vercel's environment variables dashboard.

---

## Future Roadmap

- Secure backend API integration
- Next.js migration
- Voice interaction
- User authentication
- Saved conversations
- Sanskrit transliteration support
- Personalized spiritual journeys
- Mobile application version
- 
---
Built with React 18 · Vite 5 · Anthropic Claude

Created by Sumatra Pal.
