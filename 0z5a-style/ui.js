(() => {
  const html = document.documentElement, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => (html.dataset.theme ? html.dataset.theme === 'dark' : mq.matches);

  /* ---------- grain + dust tile: pale and dark specks on black, navy and white ones on white ---------- */
  function grain() {
    const N = 159, c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d'), q = x.createImageData(N, N), a = q.data, d = dark();
    for (let i = 0; i < N * N; i++) {
      const r = Math.random(); let v = null;
      if (r < 0.07) v = d ? [200, 235, 255, 26] : [10, 42, 120, 22];
      else if (r < 0.13) v = d ? [0, 0, 0, 40] : [255, 255, 255, 70];
      if (v) a.set(v, i * 4);
    }
    x.putImageData(q, 0, 0);
    $('#grade').style.backgroundImage = `url(${c.toDataURL()})`;
    $('#grade').style.backgroundSize = `${N / (devicePixelRatio > 1.5 ? 2 : 1)}px`;
  }

  /* ---------- light / dark ---------- */
  const btn = $('#mode');
  function theme(t) {
    /* choosing what the system already says forgets the choice */
    if (t === (mq.matches ? 'dark' : 'light')) delete html.dataset.theme; else html.dataset.theme = t;
    btn.setAttribute('aria-pressed', dark());
    grain(); dispatchEvent(new Event('themechange'));
  }
  btn.addEventListener('click', () => theme(dark() ? 'light' : 'dark'));
  mq.addEventListener('change', () => { btn.setAttribute('aria-pressed', dark()); grain(); });
  btn.setAttribute('aria-pressed', dark()); grain();

  /* ---------- scroll cue / back-to-top ---------- */
  const cue = $('#cue'), top = $('#top'), about = $('#about');
  let raf = 0;
  const onScroll = () => {
    raf = 0;
    cue.classList.toggle('away', about.getBoundingClientRect().top < innerHeight * 0.85);
    top.classList.toggle('on', scrollY + innerHeight >= document.documentElement.scrollHeight - 4);
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* ---------- scraps: small plots lying across each other, turned loosely ---------- */
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  function plot(i) {
    const W = 120, H = 80, ink = 'var(--deep)', n = 14, kind = i % 3;
    let g = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" fill="var(--pale)" stroke="var(--line)"/>`;
    for (let k = 1; k < 4; k++) g += `<line x1="8" x2="${W - 8}" y1="${k * 18 + 4}" y2="${k * 18 + 4}" stroke="var(--panel)"/>`;
    if (kind === 0) {                     /* line */
      const pts = Array.from({ length: n }, (_, k) => `${8 + k * (W - 16) / (n - 1)},${H - 10 - rnd() * 40 - k * 1.2}`).join(' ');
      g += `<polyline points="${pts}" fill="none" stroke="${ink}" stroke-width="1.5"/>`;
    } else if (kind === 1) {              /* bars */
      for (let k = 0; k < 9; k++) { const h = 10 + rnd() * 48; g += `<rect x="${10 + k * 11}" y="${H - 8 - h}" width="8" height="${h}" fill="${k % 3 ? 'var(--aqua)' : 'var(--line)'}"/>`; }
    } else {                              /* scatter */
      for (let k = 0; k < 26; k++) g += `<rect x="${8 + rnd() * (W - 20)}" y="${8 + rnd() * (H - 20)}" width="3" height="3" fill="${rnd() > .5 ? 'var(--deep)' : 'var(--red)'}"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${g}</svg>`;
  }
  $$('.scraps').forEach((el, k) => {
    const count = el.dataset.scraps === 'papers' ? 9 : 4;
    el.innerHTML = Array.from({ length: count }, (_, i) => plot(i + k)).join('');
    $$('svg', el).forEach((v, i) => {
      v.style.cssText = `--w:${68 + rnd() * 26}%;--x:${(rnd() - .5) * 22}%;--y:${(i / (count - 1) - .5) * 150}%;--r:${(rnd() - .5) * 30}deg`;
    });
  });

  /* ---------- the desk: drag windows by their bars; a window lying over an earlier one gets the hard shadow ---------- */
  const wins = $$('#desk .win');
  const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  function overlaps() {
    const R = wins.map(w => w.getBoundingClientRect());
    wins.forEach((w, i) => w.classList.toggle('ov', wins.some((_, j) => j < i && hit(R[i], R[j]))));
  }
  let z = 1;
  wins.forEach(w => {
    const bar = $('.bar', w); let sx, sy, ox = 0, oy = 0, on = false;
    bar.addEventListener('pointerdown', e => {
      if (!matchMedia('(min-width:900px) and (pointer:fine)').matches || e.button) return;
      on = true; sx = e.clientX - ox; sy = e.clientY - oy; bar.setPointerCapture(e.pointerId);
      w.style.zIndex = ++z; w.classList.add('drag'); html.classList.add('dragging');
    });
    bar.addEventListener('pointermove', e => {
      if (!on) return; ox = e.clientX - sx; oy = e.clientY - sy;
      w.style.transform = `translate(${ox}px,${oy}px)`; requestAnimationFrame(overlaps);
    });
    const end = () => { on = false; w.classList.remove('drag'); html.classList.remove('dragging'); overlaps(); };
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
  });
  overlaps(); addEventListener('resize', () => requestAnimationFrame(overlaps));
  document.fonts && document.fonts.ready.then(overlaps);
})();
