# 🧠 AI Research Agent — Workshop Deck
### Research across your documents and the live web · GrowSphere Community

An animated, 65-slide HTML presentation. Every concept has its own live visual: a request travelling through a backend, a cache hit vs miss, a load balancer, a vector scatter plot, an agent router, n8n workflows that run node by node, and more.

## Run it

Open `index.html` in Chrome, Edge, Brave or Safari. Nothing to install.
Fonts and icons load from Google Fonts / jsDelivr, so connect once or serve it locally:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

The deck renders on a fixed 1600×900 stage that scales to any screen, so it looks the same on a laptop and a projector.

## Keys

| Key | Action |
|---|---|
| `→` `Space` `Enter` `PageDown` | Next (reveals the slide's punchline first, then advances) |
| `←` `Backspace` `PageUp` | Previous |
| `Home` / `End` | First / last slide |
| `G` | Slide overview grid |
| `N` | Presenter notes |
| `T` | Session timer (starts on first click) |
| `F` | Fullscreen |
| `L` | Light / dark theme (remembered) |
| Swipe | Next / previous on touch devices |

The URL hash tracks the slide (`index.html#28`), so a refresh keeps your place.

## Structure (65 slides)

| Slides | Part | Speaker |
|---|---|---|
| 1–6 | GrowSphere, speakers, hero, roadmap | — |
| 7–32 | **Part 01 · How Apps Really Work**: React in 2 min, then a generic backend deep dive (client–server, APIs, HTTP, REST, status codes, layers, monolith vs microservices, SQL/NoSQL, caching, queues, auth, security, Git & GitHub, deploy & scale) | — |
| 33–41 | **Part 02 · Give the AI Knowledge**: LLM, the 100-page problem, RAG, embeddings, vector DBs | Ashish Parab |
| 42–50 | **Part 03 · Give the AI Capabilities**: tools, agents, LangGraph, agent patterns (routing, retry) | Aditya Sabnis |
| 51–60 | **Part 04 · Automate with n8n**: concepts, triggers, AI Agent node, RAG workflows, code vs n8n, project ideas, Telegram bot walkthrough, setup | — |
| 61–65 | **Part 05 · Let's Build It**: blueprint, journey, 11-step sprint | All instructors |

## Files

```text
├── index.html        # slides (each slide carries its own <aside class="notes">)
├── styles.css        # GrowSphere design system + all animation styles
├── app.js            # stage scaling, navigation, fragments, per-slide animations
├── PRESENTATION.md   # speaker handbook
└── assets/           # community + speaker cards, logo
```

## Editing

- **Add a slide:** copy any `<section class="slide">`. Numbering, grid and notes update automatically.
- **Step-by-step reveal:** add `class="fragment"` to any element.
- **Entrance animation:** `class="reveal"` (+ `pop`/`left`/`right`), stagger with `style="--d:2"`.
- **Auto-highlight a sequence:** put `class="seq"` on a container and `class="s"` on its items.
- **Custom animation:** set `data-anim="name"` on the slide and add `name(slide)` to `anims` in `app.js`. It starts on enter and stops automatically on leave.
