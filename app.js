/* GrowSphere deck engine: navigation, fragments, per-slide animations. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  if (window.lucide) lucide.createIcons();

  const stage = $('#stage');
  const slides = $$('.slide', stage);
  const total = slides.length;
  let cur = 0;

  /* ---------- Fit the 1600×900 stage to the window ---------- */
  function fit() {
    const footer = $('.deck-footer').offsetHeight;
    const s = Math.min(innerWidth / 1600, (innerHeight - footer) / 900);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  addEventListener('resize', fit);
  fit();

  /* ---------- Animation lifecycle: everything stops when the slide changes ---------- */
  let gen = 0;
  const timers = new Set();
  const after = (ms, fn) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  };
  // A wait that never resolves once the slide is left, so async loops just end.
  const wait = ms => new Promise(res => after(ms, res));
  const frame = fn => {
    const my = gen;
    const loop = t => { if (my === gen && fn(t) !== false) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  };
  function stopAll() {
    gen++;
    timers.forEach(clearTimeout);
    timers.clear();
  }

  /* ---------- Generic behaviours ---------- */
  async function typeIn(el, text = el.dataset.type, speed = 22, delay = 700) {
    el.textContent = '';
    el.classList.add('typing');
    await wait(delay);
    for (let i = 1; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await wait(speed);
    }
    el.classList.remove('typing');
  }

  function countUp(el) {
    const target = +el.dataset.count;
    el.textContent = '0';
    after(500, () => {
      const t0 = performance.now();
      frame(t => {
        const p = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
        return p < 1;
      });
    });
  }

  // .seq lights its direct .s children in turn. data-seq-mode="build" keeps earlier ones on.
  async function runSeq(el) {
    const items = $$(':scope > .s', el);
    const ms = +el.dataset.seqMs || 1000;
    const build = el.dataset.seqMode === 'build';
    items.forEach(i => i.classList.remove('lit', 'on'));
    await wait(1400);
    for (;;) {
      for (let k = 0; k < items.length; k++) {
        items.forEach((it, j) => {
          it.classList.toggle('lit', j === k);
          if (build) it.classList.toggle('on', j <= k);
        });
        await wait(ms);
      }
      items.forEach(it => it.classList.remove('lit'));
      await wait(build ? 2600 : 700);
      if (build) {
        items.forEach(it => it.classList.remove('on'));
        await wait(500);
      }
    }
  }

  // .ring: nodes sit on a circle; a comet orbits and lights the node it passes.
  function layoutRing(ring) {
    const size = ring.offsetWidth;
    const r = size / 2 - 60;
    const nodes = $$('.rn', ring);
    nodes.forEach((n, k) => {
      const a = (-90 + (k * 360) / nodes.length) * (Math.PI / 180);
      n.style.left = size / 2 + r * Math.cos(a) + 'px';
      n.style.top = size / 2 + r * Math.sin(a) + 'px';
    });
  }
  function runRing(ring) {
    const size = ring.offsetWidth;
    const r = size / 2 - 60;
    const nodes = $$('.rn', ring);
    const comet = $('.comet', ring);
    const period = nodes.length * 1300;
    const t0 = performance.now();
    frame(t => {
      const p = ((t - t0) % period) / period;
      const a = -Math.PI / 2 + p * Math.PI * 2;
      comet.style.transform = `translate(${r * Math.cos(a)}px, ${r * Math.sin(a)}px)`;
      const idx = Math.round(p * nodes.length) % nodes.length;
      nodes.forEach((n, k) => n.classList.toggle('lit', k === idx));
    });
  }
  $$('.ring').forEach(layoutRing);

  // Graph helpers: token sits on the top edge of a node.
  const place = (tok, n, jump) => {
    if (jump) tok.style.transition = 'none';
    tok.style.left = n.style.left;
    tok.style.top = parseFloat(n.style.top) - n.offsetHeight / 2 + 'px';
    if (jump) { void tok.offsetWidth; tok.style.transition = ''; }
  };
  const litOnly = (list, el) => list.forEach(n => n.classList.toggle('lit', n === el));

  async function walkGraph(s, onStep = () => {}, onReset = () => {}) {
    const nodes = $$('.gnode', s);
    const edges = $$('.edge', s);
    const tok = $('.gtoken', s);
    for (;;) {
      nodes.forEach(n => n.classList.remove('lit'));
      edges.forEach(e => e.classList.remove('lit'));
      onReset();
      place(tok, nodes[0], true);
      await wait(1800);
      for (let i = 0; i < nodes.length; i++) {
        if (i > 0) edges[i - 1].classList.add('lit');
        place(tok, nodes[i]);
        litOnly(nodes, nodes[i]);
        onStep(i);
        await wait(1300);
      }
      await wait(2200);
    }
  }

  /* ---------- Per-slide animations (data-anim) ---------- */
  const anims = {
    hero(s) {
      const c = $('#heroCanvas', s);
      const ctx = c.getContext('2d');
      c.width = 1600;
      c.height = 900;
      const pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * 1600, y: Math.random() * 900,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      }));
      frame(() => {
        const dark = document.body.classList.contains('theme-dark');
        ctx.clearRect(0, 0, 1600, 900);
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > 1600) p.vx *= -1;
          if (p.y < 0 || p.y > 900) p.vy *= -1;
        }
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 160) {
              ctx.strokeStyle = `rgba(77,175,45,${(1 - d / 160) * (dark ? 0.35 : 0.22)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
          ctx.fillStyle = dark ? 'rgba(140,227,106,0.8)' : 'rgba(77,175,45,0.55)';
          ctx.beginPath();
          ctx.arc(pts[i].x, pts[i].y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },

    async render(s) {
      const lines = $$('.code-typer .ln', s);
      const parts = $$('.rendered > *', s);
      for (;;) {
        lines.forEach(l => { l.textContent = ''; });
        parts.forEach(p => p.classList.remove('on'));
        await wait(1000);
        for (let i = 0; i < lines.length; i++) {
          await typeIn(lines[i], lines[i].dataset.t, 30, 0);
          parts[i].classList.add('on');
          await wait(450);
        }
        await wait(3500);
      }
    },

    async css(s) {
      const mock = $('.evo', s);
      const props = $$('.css-prop', s);
      for (;;) {
        mock.classList.add('raw');
        props.forEach(p => p.classList.remove('on'));
        await wait(1500);
        for (const p of props) { p.classList.add('on'); await wait(650); }
        mock.classList.remove('raw');
        await wait(4500);
      }
    },

    async jsdemo(s) {
      const cursor = $('.js-cursor', s);
      const input = $('.js-input', s);
      const btn = $('.js-btn', s);
      const ans = $('.js-answer', s);
      const steps = $$('.js-steps .s', s);
      const mock = cursor.parentElement;
      const moveTo = el => {
        cursor.style.left = el.offsetLeft + el.offsetWidth * 0.6 + 'px';
        cursor.style.top = el.offsetTop + el.offsetHeight * 0.55 + 'px';
      };
      const answer = 'RAG finds the most relevant passages in your documents and hands them to the LLM — so answers are grounded and cited.';
      for (;;) {
        cursor.style.transition = 'none';
        cursor.style.left = mock.offsetWidth - 70 + 'px';
        cursor.style.top = mock.offsetHeight - 50 + 'px';
        void cursor.offsetWidth;
        cursor.style.transition = '';
        input.textContent = 'Ask a research question…';
        input.style.color = '';
        btn.textContent = 'Research';
        ans.textContent = '…';
        ans.classList.add('muted');
        litOnly(steps, null);
        await wait(1300);
        moveTo(input);
        await wait(1200);
        input.style.color = 'var(--ink)';
        await typeIn(input, 'What is RAG?', 70, 0);
        moveTo(btn);
        await wait(1200);
        cursor.classList.add('click');
        litOnly(steps, steps[0]);
        await wait(250);
        cursor.classList.remove('click');
        await wait(500);
        btn.innerHTML = '<span class="spinner"></span> Loading…';
        litOnly(steps, steps[1]);
        ans.textContent = 'Thinking…';
        await wait(1800);
        btn.textContent = 'Research';
        litOnly(steps, steps[2]);
        ans.classList.remove('muted');
        ans.textContent = '';
        for (const w of answer.split(' ')) { ans.textContent += w + ' '; await wait(75); }
        await wait(3800);
      }
    },

    async state(s) {
      const q = c => $(c, s);
      const count = q('.st-count'), docs = q('.st-docs'), btn = q('.st-btn'), ans = q('.st-answer');
      const vDocs = q('.st-v-docs'), vLoad = q('.st-v-load'), vAns = q('.st-v-ans'), rr = q('.rerender');
      const flash = (v, text) => {
        v.textContent = text;
        v.classList.add('flash');
        rr.style.opacity = 1;
        rr.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 450 });
        after(800, () => { v.classList.remove('flash'); rr.style.opacity = 0; });
      };
      for (;;) {
        count.textContent = '0';
        docs.innerHTML = '<span class="muted small">No documents yet</span>';
        btn.textContent = 'Research';
        ans.textContent = '…';
        ans.classList.add('muted');
        vDocs.textContent = '[]';
        vLoad.textContent = 'false';
        vAns.textContent = '""';
        await wait(1800);
        flash(vDocs, '["annual_report.pdf"]');
        docs.innerHTML = '<span class="doc-pill">📄 annual_report.pdf</span>';
        count.textContent = '1';
        await wait(1800);
        flash(vLoad, 'true');
        btn.innerHTML = '<span class="spinner"></span>';
        ans.textContent = 'Thinking…';
        await wait(1900);
        flash(vAns, '"Revenue grew 24%…"');
        vLoad.textContent = 'false';
        btn.textContent = 'Research';
        ans.classList.remove('muted');
        ans.textContent = 'Revenue grew 24% year-over-year, driven by the new product line.';
        await wait(4200);
      }
    },

    async restaurant(s) {
      const runner = $('.rest-runner', s);
      const nodes = $$('.track .node', s);
      const at = n => {
        runner.style.left = n.offsetLeft + n.offsetWidth / 2 + 'px';
        runner.style.top = n.offsetTop - 34 + 'px';
        litOnly(nodes, n);
      };
      for (;;) {
        runner.classList.remove('food');
        runner.style.transition = 'none';
        at(nodes[0]);
        void runner.offsetWidth;
        runner.style.transition = '';
        await wait(1500);
        at(nodes[1]); await wait(1300);
        at(nodes[2]); await wait(1500);
        runner.classList.add('swap'); await wait(300);
        runner.classList.add('food'); runner.classList.remove('swap');
        at(nodes[3]); await wait(1500);
        at(nodes[1]); await wait(1300);
        at(nodes[0]); await wait(2200);
      }
    },

    async tokens(s) {
      const line = $('.tk-line', s);
      const rows = $$('.tk-probs .prob', s);
      const prompt = 'Plants use photosynthesis to';
      const steps = [
        [['turn', 0.62], ['make', 0.21], ['convert', 0.12], ['eat', 0.02]],
        [['sunlight', 0.71], ['light', 0.18], ['water', 0.07], ['food', 0.03]],
        [['into', 0.88], ['and', 0.07], ['to', 0.03], ['for', 0.01]],
        [['energy', 0.66], ['sugar', 0.24], ['food', 0.08], ['pizza', 0.01]],
      ];
      const setRow = (r, w, p) => {
        r.classList.remove('win');
        r.children[0].textContent = w ? `"${w}"` : '';
        r.children[2].textContent = w ? Math.round(p * 100) + '%' : '';
        r.children[1].firstElementChild.style.width = '0';
      };
      for (;;) {
        line.innerHTML = prompt.split(' ').map(w => `<span class="tok">${w}</span>`).join(' ');
        rows.forEach(r => setRow(r));
        await wait(1300);
        for (const st of steps) {
          st.forEach(([w, p], i) => setRow(rows[i], w, p));
          await wait(120);
          st.forEach(([, p], i) => { rows[i].children[1].firstElementChild.style.width = p * 100 + '%'; });
          await wait(1100);
          rows[0].classList.add('win');
          await wait(700);
          $$('.tok.new', line).forEach(t => t.classList.remove('new'));
          line.insertAdjacentHTML('beforeend', ` <span class="tok new">${st[0][0]}</span>`);
          await wait(700);
        }
        await wait(3200);
      }
    },

    async ctx(s) {
      const fill = $('.ctx-fill', s);
      const flag = $('.ctx-flag', s);
      const [P, T, C, L] = ['.ctx-pages', '.ctx-tokens', '.ctx-cost', '.ctx-time'].map(c => $(c, s));
      const N = 16, LIMIT = 11;
      fill.innerHTML = Array.from({ length: N }, (_, i) => `<b class="${i >= LIMIT ? 'over' : ''}"></b>`).join('');
      const bars = [...fill.children];
      const set = f => {
        P.textContent = Math.round(100 * f);
        T.textContent = Math.round(200000 * f).toLocaleString('en-US');
        C.textContent = '$' + (0.6 * f).toFixed(2);
        L.textContent = Math.round(20 * f) + 's';
      };
      for (;;) {
        bars.forEach(b => b.classList.remove('on'));
        flag.style.opacity = 0;
        set(0);
        await wait(1100);
        for (let i = 0; i < N; i++) {
          bars[i].classList.add('on');
          set((i + 1) / N);
          if (i === LIMIT) {
            flag.style.opacity = 1;
            flag.animate([{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 400 });
          }
          await wait(270);
        }
        await wait(3800);
      }
    },

    embed(s) {
      const cols = $('.embed-cols', s);
      if (!cols.children.length) {
        const num = () => (Math.random() * 2 - 1).toFixed(2);
        cols.innerHTML = Array.from({ length: 24 }, (_, i) =>
          `<div class="colm" style="left:${i * 36 + 10}px; animation-duration:${7 + Math.random() * 7}s; animation-delay:-${Math.random() * 8}s;">${Array.from({ length: 14 }, num).join(' ')}</div>`
        ).join('');
      }
      typeIn($('.emb-vec', s), '[0.21, -0.43, 0.82, 0.07, -0.19, 0.55, … ×768]', 35, 1200);
    },

    async scatter(s) {
      const svg = $('.sc-svg', s);
      const sims = $$('.sim', s);
      const NS = 'http://www.w3.org/2000/svg';
      const el = (tag, attrs) => {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        return svg.appendChild(e);
      };
      if (!svg.childNodes.length) {
        let seed = 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let x = 80; x < 800; x += 80) el('line', { x1: x, y1: 20, x2: x, y2: 450, class: 'grid' });
        for (let y = 60; y < 470; y += 80) el('line', { x1: 40, y1: y, x2: 780, y2: y, class: 'grid' });
        el('line', { x1: 40, y1: 450, x2: 780, y2: 450, class: 'axis' });
        el('line', { x1: 40, y1: 20, x2: 40, y2: 450, class: 'axis' });
        const clusters = [
          { name: 'AI & retrieval', cx: 580, cy: 150, color: 'var(--green)', n: 9 },
          { name: 'Food & recipes', cx: 190, cy: 350, color: 'var(--amber)', n: 7 },
          { name: 'Sports', cx: 200, cy: 110, color: 'var(--blue)', n: 7 },
        ];
        s._pts = {};
        for (const c of clusters) {
          el('text', { x: c.cx - 60, y: c.cy + (c.cy < 200 ? -70 : 80), class: 'clabel', fill: c.color }).textContent = c.name;
          s._pts[c.name] = Array.from({ length: c.n }, () => {
            const p = { x: c.cx + (rnd() - 0.5) * 170, y: c.cy + (rnd() - 0.5) * 110 };
            el('circle', { cx: p.x, cy: p.y, r: 8, fill: c.color, class: 'pt', opacity: 0.85 });
            return p;
          });
        }
        s._q = { x: 690, y: 290 };
        const near = [...s._pts['AI & retrieval']]
          .sort((a, b) => Math.hypot(a.x - s._q.x, a.y - s._q.y) - Math.hypot(b.x - s._q.x, b.y - s._q.y))
          .slice(0, 3);
        s._lines = near.map(p => el('line', { x1: s._q.x, y1: s._q.y, x2: p.x, y2: p.y, class: 'nn' }));
        const far = s._pts['Food & recipes'][0];
        s._lines.push(el('line', { x1: s._q.x, y1: s._q.y, x2: far.x, y2: far.y, class: 'nn', style: 'stroke:var(--red); stroke-width:1.5' }));
        s._qdot = el('circle', { cx: s._q.x, cy: s._q.y, r: 0, class: 'q pt' });
        el('text', { x: s._q.x + 18, y: s._q.y + 5, class: 'lbl' }).textContent = 'your query';
      }
      for (;;) {
        s._qdot.setAttribute('r', 0);
        s._lines.forEach(l => l.classList.remove('on'));
        sims.forEach(x => x.classList.remove('on'));
        await wait(1400);
        s._qdot.setAttribute('r', 13);
        await wait(900);
        for (let i = 0; i < s._lines.length; i++) {
          s._lines[i].classList.add('on');
          sims[i].classList.add('on');
          await wait(800);
        }
        await wait(4500);
      }
    },

    async tools(s) {
      const tools = $$('.tool', s);
      const lines = $$('.toolbox line', s);
      const log = $('.tool-call', s);
      const calls = [
        [1, '# "What does our Q3 report say?"\nsearch_docs(query="Q3 revenue", k=3)'],
        [2, '# "What happened in AI today?"\ntavily.search(query="AI news today")'],
        [0, '# "What is 24% of 3.2 million?"\ncalculator("0.24 * 3_200_000")'],
      ];
      await wait(1200);
      for (;;) {
        for (const [i, text] of calls) {
          litOnly(tools, tools[i]);
          litOnly(lines, lines[i]);
          await typeIn(log, text, 18, 0);
          await wait(2200);
        }
      }
    },

    walk(s) { walkGraph(s); },

    stateflow(s) {
      const vals = [null, '"search_docs"', '["p.12 revenue…", "p.14 …"]', 'true', '"A new product line drove Q3…"'];
      const init = ['"What drove Q3 growth?"', 'null', '[]', 'null', 'null'];
      const cells = vals.map((_, i) => $('.sf-' + i, s));
      walkGraph(
        s,
        i => {
          const c = cells[i + 1];
          if (!c) return;
          c.textContent = vals[i + 1];
          c.classList.add('flash');
          after(700, () => c.classList.remove('flash'));
        },
        () => cells.forEach((c, i) => { c.textContent = init[i]; })
      );
    },

    async router(s) {
      const q = $('.rt-q', s);
      const tok = $('.gtoken', s);
      const nodes = $$('.gnode', s);
      const edges = $$('.edge', s);
      const [nq, nr, na, nb, ng] = nodes;
      const [e0, ea, eb, ea2, eb2] = ['.rt-e0', '.rt-ea', '.rt-eb', '.rt-ea2', '.rt-eb2'].map(c => $(c, s));
      const qs = [
        ['What does our annual report say about Q3 revenue?', 'a'],
        ["What's the latest AI news today?", 'b'],
      ];
      for (let k = 0; ; k++) {
        const [text, route] = qs[k % 2];
        nodes.forEach(n => n.classList.remove('lit', 'dim'));
        edges.forEach(e => e.classList.remove('lit'));
        place(tok, nq, true);
        await typeIn(q, text, 28, 500);
        litOnly(nodes, nq);
        await wait(600);
        e0.classList.add('lit');
        place(tok, nr);
        litOnly(nodes, nr);
        await wait(1300);
        const [nt, et, et2, other] = route === 'a' ? [na, ea, ea2, nb] : [nb, eb, eb2, na];
        other.classList.add('dim');
        et.classList.add('lit');
        place(tok, nt);
        litOnly(nodes, nt);
        await wait(1400);
        et2.classList.add('lit');
        place(tok, ng);
        litOnly(nodes, ng);
        await wait(2800);
      }
    },

    async retry(s) {
      const [nS, nE, nG, nR] = ['.ry-search', '.ry-eval', '.ry-gen', '.ry-rew'].map(c => $(c, s));
      const nodes = [nS, nE, nG, nR];
      const [e1, e2, e3, e4] = ['.ry-e1', '.ry-e2', '.ry-e3', '.ry-e4'].map(c => $(c, s));
      const badge = $('.ry-badge', s);
      const log = $('.ry-log', s);
      const tok = $('.gtoken', s);
      const say = t => { log.textContent += t + '\n'; };
      const go = n => { place(tok, n); litOnly(nodes, n); };
      for (;;) {
        nodes.forEach(n => n.classList.remove('lit', 'fail'));
        [e1, e2, e3, e4].forEach(e => e.classList.remove('lit'));
        badge.textContent = 'retries: 0 / 2';
        badge.className = 'retry-badge ry-badge';
        log.textContent = '';
        place(tok, nS, true);
        await wait(1500);
        go(nS); say('▶ search("Q3 growth drivers")'); await wait(1300);
        e1.classList.add('lit'); go(nE); await wait(700);
        say('  relevance 0.31  ✗ too low'); nE.classList.add('fail'); await wait(1100);
        e3.classList.add('lit'); go(nR); nE.classList.remove('fail');
        badge.textContent = 'retries: 1 / 2'; badge.classList.add('warn');
        say('↻ rewrite → "Q3 revenue growth reasons"'); await wait(1500);
        e4.classList.add('lit'); go(nS); say('▶ search("Q3 revenue growth reasons")'); await wait(1300);
        go(nE); say('  relevance 0.87  ✓ good'); badge.classList.replace('warn', 'ok'); await wait(1100);
        e2.classList.add('lit'); go(nG); say('✔ generate answer with citations'); await wait(3500);
      }
    },

    // Generic stepper: elements carry data-step="n" (or "2,3,4"). Nodes light on
    // their step and get a ✓ after; edges stay lit once reached. Optional .walk-cap
    // shows the current node's data-cap, optional .gtoken follows the lit node.
    async steps(s) {
      const els = $$('[data-step]', s).map(el => {
        const st = el.dataset.step.split(',').map(Number);
        return { el, st, min: Math.min(...st), max: Math.max(...st), edge: el.classList.contains('edge') };
      });
      const last = Math.max(...els.map(e => e.max));
      const cap = $('.walk-cap', s);
      const tok = $('.gtoken', s);
      for (;;) {
        els.forEach(e => e.el.classList.remove('lit', 'ran'));
        if (cap) cap.textContent = cap.dataset.idle || '';
        await wait(1600);
        for (let k = 1; k <= last; k++) {
          for (const e of els) {
            if (e.edge) e.el.classList.toggle('lit', e.min <= k);
            else {
              e.el.classList.toggle('lit', e.st.includes(k));
              e.el.classList.toggle('ran', e.max < k);
            }
          }
          const cur = els.find(e => !e.edge && e.st.includes(k) && e.el.dataset.cap && e.max === k)
            || els.find(e => !e.edge && e.min === k && e.el.dataset.cap);
          if (cap && cur) cap.textContent = cur.el.dataset.cap;
          if (tok && cur) place(tok, cur.el);
          await wait(1500);
        }
        els.forEach(e => { if (!e.edge) { e.el.classList.remove('lit'); e.el.classList.add('ran'); } });
        await wait(3200);
      }
    },

    async status(s) {
      const line = $('.st-req', s);
      const code = $('.st-code', s);
      const fams = $$('.fam', s);
      const colors = { 2: 'green', 3: 'blue', 4: 'amber', 5: 'red' };
      const examples = [
        ['GET /api/posts', '200 OK', 2],
        ['POST /api/posts', '201 Created', 2],
        ['GET /old-blog', '301 Moved', 3],
        ['POST /login   (wrong password)', '401 Unauthorized', 4],
        ['DELETE /users/9   (as a student)', '403 Forbidden', 4],
        ['GET /api/psots   (typo)', '404 Not Found', 4],
        ['GET /api/report   (server bug)', '500 Internal Error', 5],
      ];
      await wait(900);
      for (;;) {
        for (const [req, c, f] of examples) {
          code.textContent = '';
          code.className = 'st-code chip';
          litOnly(fams, null);
          await typeIn(line, req, 26, 0);
          await wait(350);
          code.textContent = c;
          code.classList.add(colors[f]);
          litOnly(fams, fams[f - 2]);
          await wait(2000);
        }
      }
    },

    async cache(s) {
      const nodes = $$('.gnode', s);
      const [api, cache, db] = nodes;
      const [e1, e2] = $$('.edge', s);
      const tok = $('.gtoken', s);
      const log = $('.cache-log', s);
      const ms = $('.cache-ms', s);
      const say = t => { log.textContent += t + '\n'; };
      const go = n => { place(tok, n); litOnly(nodes, n); };
      for (;;) {
        log.textContent = '';
        ms.textContent = '—';
        ms.className = 'stat-big cache-ms';
        [e1, e2].forEach(e => e.classList.remove('lit'));
        cache.classList.remove('fail');
        litOnly(nodes, null);
        place(tok, api, true);
        await wait(1500);
        say('#1  GET /trending'); go(api); await wait(800);
        e1.classList.add('lit'); go(cache); await wait(800);
        cache.classList.add('fail'); say('    cache MISS ✗'); await wait(900);
        e2.classList.add('lit'); go(db); cache.classList.remove('fail'); say('    query database … 48 ms'); await wait(1300);
        go(cache); say('    store a copy in cache'); await wait(1000);
        go(api); ms.textContent = '50 ms'; ms.classList.add('c-amber'); await wait(1800);
        say('#2  GET /trending'); go(cache); await wait(900);
        say('    cache HIT ⚡'); await wait(600);
        go(api); ms.textContent = '2 ms'; ms.className = 'stat-big cache-ms c-green'; await wait(3800);
      }
    },

    async lb(s) {
      const users = $('.lb-users', s);
      const lb = $('.lb-lb', s);
      const servers = $$('.lb-srv', s);
      const counts = $$('.lb-count', s);
      const all = $$('.gnode', s);
      const edges = $$('.graph .edge', s);
      const tok = $('.gtoken', s);
      const n = [0, 0, 0];
      counts.forEach(c => { c.textContent = '0'; });
      await wait(1800);
      for (let i = 0; ; i++) {
        const k = i % 3;
        edges.forEach(e => e.classList.remove('lit'));
        place(tok, users, true);
        litOnly(all, users);
        await wait(450);
        edges[0].classList.add('lit');
        place(tok, lb);
        litOnly(all, lb);
        await wait(750);
        edges[k + 1].classList.add('lit');
        place(tok, servers[k]);
        litOnly(all, servers[k]);
        counts[k].textContent = ++n[k];
        await wait(900);
      }
    },

    async sprint(s) {
      const items = $$('.sp:not(.go)', s);
      items.forEach(i => i.classList.remove('done'));
      await wait(2400);
      for (const it of items) { it.classList.add('done'); await wait(240); }
      confetti($('#confetti', s));
    },
  };

  function confetti(c) {
    const ctx = c.getContext('2d');
    c.width = 1600;
    c.height = 900;
    const colors = ['#6CC04A', '#4DAF2D', '#1F6F1A', '#FBBF24', '#2563EB', '#0B0F0C'];
    const ps = Array.from({ length: 180 }, () => ({
      x: 800 + (Math.random() - 0.5) * 300, y: 520,
      vx: (Math.random() - 0.5) * 22, vy: -Math.random() * 22 - 8,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      w: 8 + Math.random() * 8, h: 5 + Math.random() * 5,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    frame(() => {
      ctx.clearRect(0, 0, 1600, 900);
      let alive = false;
      for (const p of ps) {
        p.vy += 0.5; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.y < 950) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      return alive;
    });
  }

  function enter(s) {
    $$('[data-type]', s).forEach(el => typeIn(el));
    $$('[data-count]', s).forEach(countUp);
    $$('.seq', s).forEach(runSeq);
    $$('.ring', s).forEach(runRing);
    const a = anims[s.dataset.anim];
    if (a) a(s);
  }

  /* ---------- Chrome ---------- */
  const topics = ['Frontend', 'Backend', 'APIs', 'Architecture', 'Data', 'Secure & Ship', 'LLM', 'RAG', 'Agents', 'n8n', 'Build'];
  const journey = $('#journey');
  journey.innerHTML = topics.map((t, i) => (i ? '<i></i>' : '') + `<span>${t}</span>`).join('');
  const journeyItems = $$('span', journey);

  const progressBar = $('#progressBar');
  const indicator = $('#slideIndicator');
  const fragHint = $('#fragHint');
  const notesBody = $('#notesBody');
  const notesNum = $('#notesSlideNum');

  function updateChrome() {
    const s = slides[cur];
    progressBar.style.width = ((cur + 1) / total) * 100 + '%';
    indicator.textContent = `${cur + 1} / ${total}`;
    $('#btnPrev').disabled = cur === 0;
    $('#btnNext').disabled = cur === total - 1 && !$('.fragment:not(.visible)', s);
    fragHint.classList.toggle('on', !!$('.fragment:not(.visible)', s));
    const topic = s.dataset.topic === undefined ? -1 : +s.dataset.topic;
    journeyItems.forEach((el, i) => {
      el.classList.toggle('now', i === topic);
      el.classList.toggle('done', i < topic);
    });
    const notes = $('aside.notes', s);
    notesNum.textContent = cur + 1;
    notesBody.innerHTML = notes ? notes.innerHTML : '<p>No notes for this slide.</p>';
  }

  function go(i, dir = 1) {
    if (i < 0 || i >= total) return;
    stopAll();
    cur = i;
    slides.forEach((s, k) => {
      s.classList.toggle('active', k === i);
      s.classList.toggle('past', k < i);
    });
    // Going back into a slide shows it fully built; going forward starts clean.
    $$('.fragment', slides[i]).forEach(f => f.classList.toggle('visible', dir < 0));
    enter(slides[i]);
    updateChrome();
    history.replaceState(null, '', '#' + (i + 1));
    playTick();
  }

  function next() {
    const f = $('.fragment:not(.visible)', slides[cur]);
    if (f) { f.classList.add('visible'); updateChrome(); } else go(cur + 1, 1);
  }
  function prev() {
    const v = $$('.fragment.visible', slides[cur]);
    if (v.length) { v[v.length - 1].classList.remove('visible'); updateChrome(); } else go(cur - 1, -1);
  }

  /* Soft UI tick via Web Audio */
  const audioCtx = window.AudioContext ? new AudioContext() : null;
  function playTick() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.05);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /* Theme */
  const themeBtn = $('#btnThemeToggle');
  function setTheme(dark) {
    document.body.classList.toggle('theme-dark', dark);
    themeBtn.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}"></i>`;
    if (window.lucide) lucide.createIcons();
    try { localStorage.setItem('gs-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage blocked */ }
  }
  try { if (localStorage.getItem('gs-theme') === 'dark') setTheme(true); } catch (e) { /* storage blocked */ }
  themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('theme-dark')));

  /* Grid overview */
  const gridOverlay = $('#gridOverlay');
  function toggleGrid() {
    if (!gridOverlay.classList.contains('active')) {
      $('#gridThumbnails').innerHTML = slides.map((s, i) => `
        <div class="thumb-card ${i === cur ? 'active-thumb' : ''}" data-i="${i}">
          <div class="thumb-header"><span>#${i + 1}</span><span>${s.dataset.section || ''}</span></div>
          <div class="thumb-title">${s.dataset.title || ''}</div>
        </div>`).join('');
    }
    gridOverlay.classList.toggle('active');
  }
  $('#gridThumbnails').addEventListener('click', e => {
    const card = e.target.closest('.thumb-card');
    if (!card) return;
    gridOverlay.classList.remove('active');
    go(+card.dataset.i, -1);
  });

  const notesModal = $('#notesModal');
  const toggleNotes = () => notesModal.classList.toggle('active');
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  /* Timer */
  let secs = 0, timerId = null;
  const timerPill = $('#presentationTimer');
  function toggleTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    else timerId = setInterval(() => {
      secs++;
      $('#timerDisplay').textContent = `${String((secs / 60) | 0).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
    }, 1000);
    timerPill.classList.toggle('running', !!timerId);
  }

  $('#btnNext').addEventListener('click', next);
  $('#btnPrev').addEventListener('click', prev);
  $('#btnGrid').addEventListener('click', toggleGrid);
  $('#btnCloseGrid').addEventListener('click', toggleGrid);
  $('#btnNotes').addEventListener('click', toggleNotes);
  $('#btnCloseNotes').addEventListener('click', toggleNotes);
  $('#btnFullscreen').addEventListener('click', toggleFullscreen);
  timerPill.addEventListener('click', toggleTimer);

  // First interaction unlocks audio and starts the session timer.
  addEventListener('pointerdown', () => {
    if (audioCtx) audioCtx.resume().catch(() => {});
    if (!timerId && secs === 0) toggleTimer();
  }, { once: true });

  addEventListener('keydown', e => {
    if (audioCtx && audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
    const k = e.key;
    if (k === 'Escape') { gridOverlay.classList.remove('active'); notesModal.classList.remove('active'); return; }
    if (k === 'g' || k === 'G') return toggleGrid();
    if (k === 'n' || k === 'N') return toggleNotes();
    if (k === 'l' || k === 'L') return themeBtn.click();
    if (k === 'f' || k === 'F') return toggleFullscreen();
    if (k === 't' || k === 'T') return toggleTimer();
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    if (k === 'Home') { e.preventDefault(); go(0, 1); }
    if (k === 'End') { e.preventDefault(); go(total - 1, -1); }
  });

  let touchX = 0;
  addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
  addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchX;
    if (dx < -50) next();
    if (dx > 50) prev();
  }, { passive: true });

  const start = Math.min(total, Math.max(1, parseInt(location.hash.slice(1), 10) || 1)) - 1;
  go(start, 1);
})();
