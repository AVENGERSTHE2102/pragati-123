/**
 * AI RESEARCH AGENT — Interactive Workshop Presentation Engine
 * Theme: Premium Dark AI Startup (Vercel, Linear, Raycast aesthetic)
 * 
 * Features:
 * - 37 High-impact slides with smooth transitions
 * - Synthesized Web Audio API sound effects
 * - Full Keyboard, Click, and Touch/Swipe gestures
 * - Slide Overview Grid modal (Key: G)
 * - Comprehensive Speaker Notes per slide (Key: N)
 * - Presentation Timer with pause/reset (Key: T)
 * - Fullscreen toggle (Key: F)
 * - Dark / Light theme switcher (Key: L)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progressBar');
  const slideIndicator = document.getElementById('slideIndicator');
  const currentSectionBadge = document.getElementById('currentSectionBadge');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnGrid = document.getElementById('btnGrid');
  const btnNotes = document.getElementById('btnNotes');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const gridOverlay = document.getElementById('gridOverlay');
  const btnCloseGrid = document.getElementById('btnCloseGrid');
  const gridThumbnails = document.getElementById('gridThumbnails');
  const notesModal = document.getElementById('notesModal');
  const btnCloseNotes = document.getElementById('btnCloseNotes');
  const notesSlideNum = document.getElementById('notesSlideNum');
  const notesBody = document.getElementById('notesBody');
  const timerDisplay = document.getElementById('timerDisplay');
  const presentationTimer = document.getElementById('presentationTimer');

  let currentSlide = 1;
  const totalSlides = slides.length;

  // =========================================================================
  // Comprehensive Speaker Notes Database (37 Slides)
  // =========================================================================
  const speakerNotes = {
    1: `<strong>GrowSphere Intro:</strong> Welcome everyone! GrowSphere is Mumbai's premier student developer community where we build real-world software MVPs, learn cutting-edge tools, and grow together. Today's workshop is a masterclass in building an autonomous AI Research Agent.`,
    2: `<strong>Speaker 1 — Dev Kanojiya:</strong> Full Stack Developer leading Section 1: "From Web to AI". Dev bridges the gap between raw web fundamentals and modern AI backends.`,
    3: `<strong>Speaker 2 — Ashish Parab:</strong> Software Developer & SDE Intern @ Cactus Communications leading Section 2: "LLM, RAG & Embeddings". Ashish covers how AI reasons over private documents.`,
    4: `<strong>Speaker 3 — Aditya Sabnis:</strong> AI Full-Stack Engineer, Monad Blitz Hackathon Winner & GrowSphere Co-founder leading Section 3: "Tools, Agents & LangGraph". Aditya breaks down autonomous graph workflows.`,
    5: `<strong>Workshop Agenda:</strong> 60 Minutes Total (20m per speaker) covering the journey from browser basics to an autonomous AI agent that searches private PDFs and the live web before our live coding sprint.`,
    6: `<strong>Hero Title:</strong> Welcome to AI Research Agent! Today isn't about memorizing syntax or dry theory. It's about giving you the exact mental model so when we open VS Code, you know why every line of code exists.`,
    7: `<strong>AI Apps Are Still Software:</strong> Demystify AI. AI is not magic that replaces software engineering. It is simply an intelligent backend component that fits into standard software architecture.`,
    8: `<strong>Start With the Browser:</strong> Break the frontend into 3 simple pillars: HTML (Structure/Skeleton), CSS (Appearance/Skin), and JavaScript (Behavior/Muscles). No code needed here—just visual clarity.`,
    9: `<strong>Then Comes React:</strong> Explain component architecture. Instead of writing monolithic HTML pages, React lets us build reusable blocks like QuestionBox, UploadZone, and AnswerCard with dynamic state.`,
    10: `<strong>The Frontend Needs Help:</strong> Crucial security principle: Never put secret API keys (Groq, Gemini, Tavily) inside client-side JavaScript. The frontend delegates heavy lifting to a secure FastAPI backend.`,
    11: `<strong>What is an API?:</strong> Use the classic restaurant analogy. Customer (User) -> Menu/UI (React) -> Waiter (API) -> Kitchen (FastAPI) -> Chef/Dish (LLM Output). An API is just the communication bridge.`,
    12: `<strong>HTTP in One Minute:</strong> Explain the universal JSON conversation. Frontend sends a POST request with {"question": "..."}, the backend processes it, and returns {"answer": "..."}. That is the foundation of all AI web apps.`,
    13: `<strong>Now Add AI:</strong> Show the complete 5-stage loop. React UI -> FastAPI Server -> Groq LLM -> FastAPI -> React UI. The LLM is just another API our backend calls.`,
    14: `<strong>Speaker 1 Recap:</strong> Dev passes the mic: We now know how to connect a browser to an AI model. But what happens when a user uploads a 100-page private PDF that the AI has never seen before?`,
    15: `<strong>The 100-Page PDF Problem:</strong> Why can't we just copy-paste a 100-page PDF into an LLM prompt? It's too slow, costs too many tokens, and models get lost in massive context. We need a targeted retrieval system.`,
    16: `<strong>LLMs Don't Know Your Files:</strong> Clearly distinguish Model Pre-training (public web data up to cutoff) from Your Private Data (user PDFs, invoices, lecture notes). The model has zero knowledge of your private files by default.`,
    17: `<strong>The Solution: RAG:</strong> Introduce Retrieval-Augmented Generation. RAG = Search the exact relevant paragraphs from the PDF first (Retrieval), then hand them to the LLM to write the response (Generation).`,
    18: `<strong>RAG in One Picture:</strong> Walk through the 7-step horizontal pipeline: Document -> Chunks -> Embeddings -> Vector DB -> Top-K Retrieval -> LLM -> Grounded Answer with Citations.`,
    19: `<strong>Why Chunk the Document?:</strong> Explain chunking intuition. Searching a 100-page book for one sentence is hard. Splitting it into 500-word bite-sized paragraphs makes precision search instant and accurate.`,
    20: `<strong>What is an Embedding?:</strong> The core intuition: Computers cannot understand the meaning of English words directly. An embedding converts textual meaning into a list of numbers (a vector) so computers can measure mathematical closeness.`,
    21: `<strong>Semantic Similarity in Vector Space:</strong> Show why vector search beats keyword search. "How does RAG retrieve info?" and "How does retrieval augmented generation work?" have zero keyword overlap but identical vector coordinates!`,
    22: `<strong>The Vector Database: ChromaDB:</strong> A traditional database searches exact text. A Vector Database (ChromaDB) searches geometric similarity at lightning speed using Cosine Similarity.`,
    23: `<strong>Our Complete RAG Stack:</strong> Explicitly reveal our workshop choices: Google Gemini Embeddings API for vectorization, ChromaDB for vector storage, and Groq (Llama-3) for ultra-fast LLM inference.`,
    24: `<strong>Document Question Walkthrough:</strong> Step-by-step trace of a live user query. User asks question -> Embed question -> ChromaDB finds top 3 paragraphs -> Groq synthesizes final answer with citations.`,
    25: `<strong>Speaker 2 Recap:</strong> Ashish passes the mic: Now our AI can reason over any uploaded PDF with zero hallucinations. But what if the user asks a question about breaking news that happened this morning?`,
    26: `<strong>The Web is Another Source:</strong> Introduce live web search. Documents alone are static. When questions need fresh facts or external verification, our AI must access the live internet via Tavily AI Search.`,
    27: `<strong>Give the AI a Tool:</strong> Concept shift: An LLM by itself only produces words. When we give it Tools (search, calculator, database access), the LLM transforms into an active agent that can take actions.`,
    28: `<strong>LLM vs RAG vs Agent:</strong> 3-tier evolution: LLM (pure text generation) -> RAG (passive document retrieval) -> AGENT (autonomous reasoning, tool selection, and dynamic decision-making).`,
    29: `<strong>What Makes Something an Agent?:</strong> The Perception-Action Loop: Question -> Decide what tool to use -> Execute tool -> Observe output -> Decide if more information is needed -> Deliver answer.`,
    30: `<strong>Our Agent's Two Super Tools:</strong> Show the agent's arsenal: Tool 1 is ChromaDB for local document search; Tool 2 is Tavily for live real-time web search. The agent dynamically decides which tool to call.`,
    31: `<strong>Why LangGraph?:</strong> Real-world workflows have branches, loops, and condition checks. LangGraph lets us model an AI agent as a stateful graph where nodes are functions and edges are decision paths.`,
    32: `<strong>LangGraph 3 Core Concepts:</strong> 1. State (shared memory dictionary), 2. Node (a Python function that performs an action), 3. Edge / Conditional Edge (the routing logic that decides the next step).`,
    33: `<strong>The Complete Decision Architecture:</strong> Walk through the master decision graph: Router evaluates question -> Calls Document Search or Web Search -> Evaluates search quality -> Branches to Final Answer or Query Rewrite.`,
    34: `<strong>The Self-Correcting Retry Loop:</strong> The superpower of modern agents: When search results are poor or ambiguous, the agent rewrites the search query and searches again (up to 2 retries) before delivering a polished answer.`,
    35: `<strong>The Master Architecture Blueprint:</strong> Full-screen unified system diagram showing React Frontend -> FastAPI Backend -> LangGraph Agent -> ChromaDB/Tavily -> Groq -> Citations. This is what we build today!`,
    36: `<strong>The Complete Mental Model:</strong> We didn't learn 10 disconnected buzzwords. We solved 10 fundamental engineering problems step-by-step. The audience now has complete architectural clarity.`,
    37: `<strong>Hands-On Starts Now!:</strong> Transition to live coding! 8 clear implementation steps. Open VS Code, configure keys, build FastAPI, integrate LangGraph, connect React, and run our AI Research Agent live!`
  };

  // =========================================================================
  // Web Audio API Synthesizer (Modern UI Chimes)
  // =========================================================================
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'slide') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  }

  // =========================================================================
  // Slide Navigation Logic
  // =========================================================================
  function updateSlide(newIndex, playAudio = true) {
    if (newIndex < 1) newIndex = 1;
    if (newIndex > totalSlides) newIndex = totalSlides;

    slides.forEach(slide => slide.classList.remove('active'));

    currentSlide = newIndex;
    const activeSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    if (activeSlide) {
      activeSlide.classList.add('active');
      const section = activeSlide.getAttribute('data-section') || 'AI Research Agent';
      currentSectionBadge.textContent = section;
    }

    // Update Progress Bar & Counter
    const progressPercent = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    progressBar.style.width = `${Math.max(progressPercent, 2.5)}%`;
    slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;

    btnPrev.disabled = currentSlide === 1;
    btnNext.disabled = currentSlide === totalSlides;

    // Update Speaker Notes if drawer is open
    notesSlideNum.textContent = currentSlide;
    notesBody.innerHTML = speakerNotes[currentSlide] || `<p>No specific notes for slide ${currentSlide}.</p>`;

    // Update Grid modal active thumbnail
    document.querySelectorAll('.thumb-card').forEach(thumb => {
      thumb.classList.toggle('active-thumb', parseInt(thumb.dataset.slide) === currentSlide);
    });

    if (playAudio) playSound('slide');
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      updateSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      updateSlide(currentSlide - 1);
    }
  }

  // =========================================================================
  // Button Event Listeners
  // =========================================================================
  btnNext.addEventListener('click', () => nextSlide());
  btnPrev.addEventListener('click', () => prevSlide());

  // Fullscreen
  btnFullscreen.addEventListener('click', () => {
    playSound('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  });

  // Theme Toggle (Dark / Light)
  function toggleTheme() {
    playSound('click');
    document.body.classList.toggle('theme-light');
    const isLight = document.body.classList.contains('theme-light');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', toggleTheme);
  }

  // Grid Modal
  function toggleGrid() {
    playSound('click');
    gridOverlay.classList.toggle('active');
  }

  btnGrid.addEventListener('click', toggleGrid);
  btnCloseGrid.addEventListener('click', toggleGrid);

  // Notes Modal
  function toggleNotes() {
    playSound('click');
    notesModal.classList.toggle('active');
  }

  btnNotes.addEventListener('click', toggleNotes);
  btnCloseNotes.addEventListener('click', toggleNotes);

  // Build Grid Thumbnails
  function buildGridThumbnails() {
    gridThumbnails.innerHTML = '';
    slides.forEach(slide => {
      const num = slide.getAttribute('data-slide');
      const section = slide.getAttribute('data-section') || 'Slide';
      const titleElem = slide.querySelector('.slide-title, .hero-title-huge');
      const titleText = titleElem ? titleElem.textContent.replace(/🚀/g, '').trim() : `Slide ${num}`;

      const card = document.createElement('div');
      card.className = `thumb-card ${parseInt(num) === currentSlide ? 'active-thumb' : ''}`;
      card.dataset.slide = num;
      card.innerHTML = `
        <div class="thumb-header">
          <span>#${num}</span>
          <span>${section}</span>
        </div>
        <div class="thumb-title">${titleText}</div>
      `;

      card.addEventListener('click', () => {
        updateSlide(parseInt(num));
        gridOverlay.classList.remove('active');
      });

      gridThumbnails.appendChild(card);
    });
  }

  buildGridThumbnails();

  // =========================================================================
  // Keyboard Navigation
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    // If modal is open, Escape closes it
    if (e.key === 'Escape') {
      if (gridOverlay.classList.contains('active')) gridOverlay.classList.remove('active');
      if (notesModal.classList.contains('active')) notesModal.classList.remove('active');
      return;
    }

    // Toggle Grid with 'G' or 'g'
    if (e.key === 'g' || e.key === 'G') {
      toggleGrid();
      return;
    }

    // Toggle Notes with 'N' or 'n'
    if (e.key === 'n' || e.key === 'N') {
      toggleNotes();
      return;
    }

    // Toggle Fullscreen with 'F' or 'f'
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
      return;
    }

    // Toggle Timer with 'T' or 't'
    if (e.key === 't' || e.key === 'T') {
      toggleTimer();
      return;
    }

    // Toggle Theme with 'L' or 'l'
    if (e.key === 'l' || e.key === 'L') {
      toggleTheme();
      return;
    }

    // Next Slide
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      nextSlide();
    }

    // Previous Slide
    if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      prevSlide();
    }

    // Home / End
    if (e.key === 'Home') {
      e.preventDefault();
      updateSlide(1);
    }
    if (e.key === 'End') {
      e.preventDefault();
      updateSlide(totalSlides);
    }
  });

  // =========================================================================
  // Touch / Swipe Navigation
  // =========================================================================
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }, { passive: true });

  // =========================================================================
  // Presentation Timer (Stopwatch)
  // =========================================================================
  let timerInterval = null;
  let secondsElapsed = 0;
  let isTimerRunning = false;

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function toggleTimer() {
    playSound('click');
    if (!isTimerRunning) {
      isTimerRunning = true;
      timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = formatTime(secondsElapsed);
      }, 1000);
      presentationTimer.style.borderColor = 'var(--brand-purple)';
      presentationTimer.style.color = 'var(--brand-purple-light)';
    } else {
      isTimerRunning = false;
      clearInterval(timerInterval);
      presentationTimer.style.borderColor = 'var(--border-card)';
      presentationTimer.style.color = 'var(--text-muted)';
    }
  }

  presentationTimer.addEventListener('click', toggleTimer);

  // Auto-start timer on first user interaction
  window.addEventListener('click', () => {
    if (!isTimerRunning && secondsElapsed === 0) {
      toggleTimer();
    }
  }, { once: true });

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set initial state
  updateSlide(1, false);
});
