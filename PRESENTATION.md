# AI RESEARCH AGENT 🧠⚡ — Speaker Handbook
*GrowSphere workshop · 60 animated slides*

**Audience:** students with little or no background in backend, APIs, AI or automation.
**Teaching rule:** Problem → Solution → Technology.
**Flow:** How apps work (mostly backend) → AI knowledge → AI agents → automation with n8n → build it live.

**Presenting tips**
- Most slides end with a black takeaway card. Press → once to reveal it, then → again to move on.
- The animations loop, so talk over them. Leaving a slide stops its animation; coming back replays it.
- `N` opens notes, `G` opens the slide grid, and the footer shows the current topic.

---

## Intro (1–6)
GrowSphere · Ashish Parab · Aditya Sabnis · Omkar Mahadik (`assets/devendra.jpeg`) · Hero · Roadmap (5 parts)

## Part 01 · How Apps Really Work (7–27)
Generic, not project-specific. React is kept to 2 slides; the rest is backend.

| # | Slide | Visual |
|---|---|---|
| 7 | Divider | — |
| 8 | Every app has two halves | Iceberg: frontend tip, backend pieces light up underwater |
| 9 | React = components | Component tree draws itself |
| 10 | React has State | Live state panel → re-render; "data comes from the backend" |
| 11 | What does a backend do? | 6 jobs: logic, data, auth, integrations, heavy work, security |
| 12 | Why not in the browser? | API key stolen from view-source; phone memory bar explodes |
| 13 | Life of a request | Client → DNS → Server → Code → DB → Response, with step captions |
| 14 | What is an API? | Restaurant: order ticket travels and comes back as food |
| 15 | Anatomy of an HTTP request | Method, path, headers, body / status, body; packets travel |
| 16 | HTTP methods = CRUD | GET/POST/PATCH/DELETE on `/posts` |
| 17 | Status codes | Live requests cycle; 2xx/3xx/4xx/5xx family lights up |
| 18 | What backend code looks like | Same endpoint in FastAPI and Express, plus other frameworks |
| 19 | Layers | Route → Controller → Service → Repository → DB, with captions |
| 20 | Monolith vs microservices | One box vs gateway + services |
| 21 | SQL vs NoSQL | Table rows vs JSON document |
| 22 | Caching | Miss (50 ms) then hit (2 ms), with a log |
| 23 | Background jobs & queues | 202 Accepted; jobs flow through a queue to workers |
| 24 | Authentication vs authorization | Login → verify hash → token → request → permission (401 vs 403) |
| 25 | Security checklist | env secrets, hashing, validation, SQL injection, HTTPS, rate limits |
| 26 | Deploy & scale | git push → CI → deploy → live; load balancer round-robin to 3 servers |
| 27 | Full backend picture | Clients → backend → DB / cache / queue / external APIs → "give it a brain" |

## Part 02 · Give the AI Knowledge (28–36 · Ashish Parab)
Divider · LLM next-word prediction · The 100-page problem · RAG = open-book exam · RAG in 6 steps · Keyword vs semantic search · Embeddings · Vector search in 2D · Vector databases (ChromaDB, Pinecone, Qdrant, pgvector)

## Part 03 · Give the AI Capabilities (37–45 · Aditya Sabnis)
Divider · Not in the PDF (live web) · Tools · LLM vs RAG vs Agent · Decision cycle · Agents need a workflow · LangGraph = State + Nodes + Edges · Agent pattern: routing · Agent pattern: retry loop

## Part 04 · Automate with n8n (46–55)
| # | Slide | Visual |
|---|---|---|
| 46 | Divider | — |
| 47 | What is n8n? | Gmail → AI Agent → IF → Slack / Sheets runs node by node |
| 48 | Six core ideas | Workflow, trigger, actions, JSON items, expressions, credentials |
| 49 | Triggers | Webhook, schedule, app event, chat, form (a webhook = an API endpoint) |
| 50 | AI Agent node | Chat trigger → agent with model / tools / memory sub-nodes → reply |
| 51 | RAG in n8n | Ingest lane + ask lane |
| 52 | Code or n8n? | Strengths of each; they work together via HTTP Request + webhook |
| 53 | Automations to build | Inbox triage, news digest, FAQ bot, resume screener… |
| 54 | Telegram AI assistant | 6 build steps + system message |
| 55 | Get started | `npx n8n` / Docker, templates, debugging tips |

## Part 05 · Let's Build It (56–60 · all instructors)
Divider · Master blueprint · Journey in 4 levels · You're ready · 11-step sprint + confetti

---

## 11-step sprint
1 Setup (venv) · 2 FastAPI scaffold · 3 Doc upload & chunking · 4 Embeddings · 5 ChromaDB index · 6 LangGraph state & nodes · 7 Tavily tool · 8 Groq Llama 3 · 9 React UI · 10 Streaming (SSE) · 11 Test & demo
