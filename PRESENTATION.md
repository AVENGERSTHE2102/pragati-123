# AI RESEARCH AGENT 🧠⚡
## Research Across Your Documents and the Web
*GrowSphere Student Tech Community Workshop — Complete Progressive Learning Deck (44 Slides)*

---

## 🧭 Workshop Overview
* **Presented by:** GrowSphere Community
* **Title:** AI Research Agent: Research Across Your Documents and the Web
* **Format:** Interactive Web-Style Presentation (GrowSphere Design System) followed by a Live Hands-On Coding Sprint.
* **Duration:** 60 Minutes (3 Speakers × 20 Minutes) + 10-Minute Transition into Hands-on Implementation.
* **Target Audience:** Students and developers who may have little or no prior knowledge of HTML, CSS, JavaScript, React, APIs, embeddings, RAG, LangChain, agents, or LangGraph.
* **Core Teaching Principle:** **PROBLEM → SOLUTION → TECHNOLOGY** (Every technology is introduced strictly after the problem requiring it has been made obvious).
* **Interactive Engine:** Built into [`index.html`](file:///c:/Users/Birendra%20Archana/Desktop/tp1/index.html) with GrowSphere design system, sequential glowing flowchart animations, Web Audio API sound effects, slide overview grid (`G`), speaker notes modal (`N`), live session timer (`T`), fullscreen mode (`F`), and theme toggle (`L`).

---

## 🗺️ The Progressive Learning Journey

```text
WEB
 ↓
HTML
 ↓
CSS
 ↓
JavaScript
 ↓
REACT
 ↓
COMPONENTS
 ↓
API
 ↓
BACKEND
 ↓
FASTAPI
 ↓
LLM
 ↓
RAG
 ↓
EMBEDDINGS
 ↓
VECTOR DATABASE (ChromaDB)
 ↓
TOOLS (Tavily)
 ↓
AGENTS
 ↓
LANGGRAPH
 ↓
OUR AI RESEARCH AGENT
```

---

## 👥 Speaker Lineup & Topic Allocations

### 1. DEV KANOJIYA (Speaker 01 — 20 Minutes)
* **Topic:** *Web Fundamentals → React → APIs → FastAPI → First AI Loop*
* **Slides:** 7–22 (User Slides 01–16)
* **Focus:** How the browser works, HTML structure, CSS styling, JavaScript behavior, React component trees, State as UI memory, why backend is needed, REST APIs & JSON packets, and FastAPI.

### 2. ASHISH PARAB (Speaker 02 — 20 Minutes)
* **Topic:** *LLM → 100-Page Problem → RAG → Embeddings → ChromaDB*
* **Slides:** 23–30 (User Slides 17–24)
* **Focus:** What an LLM is, the 100-page document limit, the Open-Book Exam analogy (RAG), text chunking, embedding vectors (768D semantic numbers), 2D vector space similarity, and ChromaDB vector store.

### 3. ADITYA SABNIS (Speaker 03 — 20 Minutes)
* **Topic:** *Tools → Live Web (Tavily) → Agents → LangGraph Workflows*
* **Slides:** 31–40 (User Slides 25–34)
* **Focus:** Why RAG alone isn't enough for today's news, function calling tools, Tavily web search, LLM vs RAG vs Agent comparison, the Perception-Action decision loop, LangGraph State/Nodes/Edges, dynamic query routing, and the self-correcting retry loop (`max_retries = 2`).

### 4. MAIN LEAD / ALL INSTRUCTORS (Final 5–10 Minutes)
* **Topic:** *Master Blueprint & Live Coding Sprint*
* **Slides:** 41–44 (User Slides 35–38)
* **Focus:** The unified master architecture diagram, 4-level journey summary, concept-to-code alignment, and the 11-step practical implementation sprint.

---

## 📋 Slide-by-Slide Outline & Speaker Cues

### Part 0: GrowSphere & Speakers (Slides 1–6)
* **Slide 1:** GrowSphere Community Welcome (`assets/growsphere_overview.png`)
* **Slide 2:** Speaker 1 — Dev Kanojiya (`assets/dev_kanojiya.png`)
* **Slide 3:** Speaker 2 — Ashish Parab (`assets/ashish_parab.png`)
* **Slide 4:** Speaker 3 — Aditya Sabnis (`assets/aditya_sabnis.jpg`)
* **Slide 5:** Lead / Organizer — Devendra (`assets/devendra.jpeg`)
* **Slide 6:** Hero Title Slide: AI Research Agent 🧠⚡

---

### Section 01: Web Fundamentals (Slides 7–13 // Speaker 01: Dev Kanojiya)
* **Slide 7 (User 01):** Every AI App Starts with an Interface (Browser mockup + Interface → Logic → Data → AI).
* **Slide 8 (User 02):** What Does the Browser Actually Do? (Your Code → Browser → Interactive Website).
* **Slide 9 (User 03):** The Three Building Blocks (HTML Structure, CSS Style, JS Behavior cards).
* **Slide 10 (User 04):** HTML = Structure (Wireframe boxes: Header, Upload, Input, Button, Card).
* **Slide 11 (User 05):** CSS = Appearance (Spacing + Typography + Colors + Layout).
* **Slide 12 (User 06):** JavaScript = Behavior (Button before/after click: Research → Loading → Answer).
* **Slide 13 (User 07):** But Real Applications Get Big (The complexity of 8 features in one HTML file).

---

### Section 02: React (Slides 14–17 // Speaker 01: Dev Kanojiya)
* **Slide 14 (User 08):** Meet React: Build UI from Components (Component tree hierarchy).
* **Slide 15 (User 09):** What is a Component? (&lt;Header /&gt;, &lt;Upload /&gt;, &lt;Question /&gt;, &lt;Answer /&gt;).
* **Slide 16 (User 10):** React Has State (UI's memory: Documents 0 → 1, isLoading, answer).
* **Slide 17 (User 11):** Now We Have a Frontend (Where does the actual AI work happen?).

---

### Section 03: Frontend → Backend (Slides 18–22 // Speaker 01: Dev Kanojiya)
* **Slide 18 (User 12):** The Frontend Cannot Do Everything (API keys and 50MB files cannot live in browser).
* **Slide 19 (User 13):** What is an API? The Restaurant Analogy (Customer → Waiter → Kitchen → Food).
* **Slide 20 (User 14):** Request → Response (JSON packets over HTTP POST /research).
* **Slide 21 (User 15):** Meet FastAPI (Python AI ecosystem + high-speed backend server).
* **Slide 22 (User 16):** Our First AI App (User → React → FastAPI → LLM → FastAPI → React).

---

### Section 04: LLM → RAG (Slides 23–26 // Speaker 02: Ashish Parab)
* **Slide 23 (User 17):** Meet the LLM (Language model that does not know your private PDF).
* **Slide 24 (User 18):** The 100-Page Document Problem (Context limits, token cost, latency, hallucination).
* **Slide 25 (User 19):** The Solution: RAG (Open-Book Exam analogy).
* **Slide 26 (User 20):** How RAG Works in 6 Steps (Document → Chunks → Embeddings → Vector DB → Search → Answer).

---

### Section 05: Embeddings & Vector DB (Slides 27–30 // Speaker 02: Ashish Parab)
* **Slide 27 (User 21):** Why Can't We Just Search Keywords? (Synonyms & semantic mismatch).
* **Slide 28 (User 22):** What is an Embedding? (Text into 768-dimensional coordinate numbers).
* **Slide 29 (User 23):** Vector Search in 2D Space (Cosine similarity clusters).
* **Slide 30 (User 24):** Meet ChromaDB: The Vector Database (Local nearest-neighbor search <5ms).

---

### Section 06: Tools (Slides 31–32 // Speaker 03: Aditya Sabnis)
* **Slide 31 (User 25):** What If the Answer Isn't in the PDF? (Today's live news vs static document).
* **Slide 32 (User 26):** Give the AI Tools to Act (Meet Tavily real-time web search for agents).

---

### Section 07: Agents (Slides 33–34 // Speaker 03: Aditya Sabnis)
* **Slide 33 (User 27):** LLM vs RAG vs AI Agent (Generates vs Retrieves vs Decides).
* **Slide 34 (User 28):** What Makes an Agent? The Decision Cycle (Question → Decide → Action → Observe → Decide Again → Answer).

---

### Section 08: LangGraph (Slides 35–40 // Speaker 03: Aditya Sabnis)
* **Slide 35 (User 29):** Now We Have a Multi-Step Workflow.
* **Slide 36 (User 30):** LangGraph = State + Nodes + Edges.
* **Slide 37 (User 31):** Nodes: The 5 Work Units in Our System.
* **Slide 38 (User 32):** Edges: Connecting the Steps.
* **Slide 39 (User 33):** Conditional Edges: The Router Node (ChromaDB vs Tavily).
* **Slide 40 (User 34):** The Self-Correcting Retry Loop (`max_retries = 2`).

---

### Final Section: Our Project (Slides 41–44 // All Instructors)
* **Slide 41 (User 35):** Put Everything Together: The Master Blueprint.
* **Slide 42 (User 36):** The Entire Journey in 4 Clear Levels.
* **Slide 43 (User 37):** You Understand the Architecture: Concept → Code → Build → Experiment.
* **Slide 44 (User 38):** LET'S BUILD THE AI RESEARCH AGENT 🚀 (11-Step Hands-on Coding Sprint).
