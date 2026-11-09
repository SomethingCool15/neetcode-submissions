/* Low-poly "stations" scene in raw WebGL: one vertex buffer, one draw call, tones baked at build time.
   Each face takes one of three flat tones from its angle to the light; fog runs toward the sky colour.
   Vertex layout: position(3) colour(3) spin(4) where spin = [mode, cx, cz, speed]
     mode  0  static
     mode  1  turns about the vertical axis through (cx,cz) at `speed` rad/s
     mode -1  the sun (unshaded, no fog, faces the camera)
     mode -2  the sun's halo (light theme only)                                                       */
(() => {
  const html = document.documentElement;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (html.dataset.theme ? html.dataset.theme === 'dark' : mq.matches);

  const cv = document.getElementById('gl');
  const gl = cv.getContext('webgl', { antialias: true, alpha: false, depth: true, powerPreference: 'high-performance' });
  if (!gl) { cv.remove(); return; }

  /* ---------- tiny vector helpers ---------- */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const LIGHT = norm([-0.42, 0.74, 0.52]);

  const THEMES = {
    dark:  { sky: [0, 0, 0], halo: [0, 0, 0],
      pal: { stone: ['#d9f3ff', '#6fa6bf', '#17323f'], flute: ['#ffffff', '#dcf5ff', '#a4e0fa'], red: ['#ff3f5e', '#e0304e', '#9c1c36'], sun: ['#ffffff', '#ffffff', '#ffffff'] } },
    light: { sky: [1, 1, 1], halo: hex('#bfeef2'),
      pal: { stone: ['#ffffff', '#c9ddec', '#8caac4'], flute: ['#fbfeff', '#c8eefc', '#7fcdf6'], red: ['#ff3f5e', '#e0304e', '#9c1c36'], sun: ['#ffffff', '#ffffff', '#ffffff'] } }
  };

  /* ---------- geometry builder ---------- */
  let V, PAL, seed;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tone = (n, mat) => { const d = dot(n, LIGHT), p = PAL[mat]; return d > 0.42 ? p[0] : d > -0.12 ? p[1] : p[2]; };
  const push = (p, c, s) => V.push(p[0], p[1], p[2], c[0], c[1], c[2], s[0], s[1], s[2], s[3]);

  /* A triangle, its normal flipped to face away from `out` so winding never matters. */
  function tri(a, b, c, mat, out, s) {
    let n = norm(cross(sub(b, a), sub(c, a)));
    if (dot(n, sub(a, out)) < 0) n = n.map(v => -v);
    const col = tone(n, mat);
    push(a, col, s); push(b, col, s); push(c, col, s);
  }
  const quad = (a, b, c, d, mat, out, s) => { tri(a, b, c, mat, out, s); tri(a, c, d, mat, out, s); };

  const rotY = (p, ang) => { const c = Math.cos(ang), s = Math.sin(ang); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };

  /* Box centred at (x,y,z), turned `ang` about the vertical. */
  function box(x, y, z, sx, sy, sz, mat, ang = 0, s = [0, 0, 0, 0]) {
    const P = [];
    for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) {
      const q = rotY([i * sx / 2, j * sy / 2, k * sz / 2], ang); P.push([q[0] + x, q[1] + y, q[2] + z]);
    }
    const o = [x, y, z], at = (i, j, k) => P[((i + 1) / 2) * 4 + ((j + 1) / 2) * 2 + (k + 1) / 2];
    quad(at(-1, -1, -1), at(1, -1, -1), at(1, 1, -1), at(-1, 1, -1), mat, o, s);
    quad(at(-1, -1, 1), at(1, -1, 1), at(1, 1, 1), at(-1, 1, 1), mat, o, s);
    quad(at(-1, -1, -1), at(-1, -1, 1), at(-1, 1, 1), at(-1, 1, -1), mat, o, s);
    quad(at(1, -1, -1), at(1, -1, 1), at(1, 1, 1), at(1, 1, -1), mat, o, s);
    quad(at(-1, -1, -1), at(1, -1, -1), at(1, -1, 1), at(-1, -1, 1), mat, o, s);
    quad(at(-1, 1, -1), at(1, 1, -1), at(1, 1, 1), at(-1, 1, 1), mat, o, s);
  }

  /* A faceted body lofted through rings [y, radius]; n sides; capped at both ends. */
  function loft(cx, cz, rings, n, mat, rot = 0, s = [0, 0, 0, 0]) {
    const ring = ([y, r]) => Array.from({ length: n }, (_, i) => {
      const a = rot + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
    });
    const R = rings.map(ring), mid = [cx, (rings[0][0] + rings[rings.length - 1][0]) / 2, cz];
    for (let k = 0; k < R.length - 1; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n; quad(R[k][i], R[k][j], R[k + 1][j], R[k + 1][i], mat, [cx, (rings[k][0] + rings[k + 1][0]) / 2, cz], s);
    }
    for (const [k, y] of [[0, rings[0][0]], [R.length - 1, rings[rings.length - 1][0]]]) {
      if (rings[k][1] <= 0) continue;
      for (let i = 0; i < n; i++) tri([cx, y, cz], R[k][i], R[k][(i + 1) % n], mat, mid, s);
    }
  }

  /* Convex solid from points + faces found by edge length (octahedron, icosahedron). */
  function solid(cx, cy, cz, pts, mat, s) {
    const c = [cx, cy, cz], P = pts.map(p => [p[0] + cx, p[1] + cy, p[2] + cz]);
    let e = Infinity;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) e = Math.min(e, Math.hypot(...sub(P[i], P[j])));
    const near = (a, b) => Math.abs(Math.hypot(...sub(P[a], P[b])) - e) < e * 0.02;
    for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) for (let d = b + 1; d < P.length; d++)
      if (near(a, b) && near(b, d) && near(a, d)) tri(P[a], P[b], P[d], mat, c, s);
  }
  const OCTA = r => [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
  const ICO = r => { const t = (1 + Math.sqrt(5)) / 2, k = r / Math.hypot(1, t), o = [];
    for (const a of [-1, 1]) for (const b of [-t, t]) o.push([0, a * k, b * k], [a * k, b * k, 0], [b * k, 0, a * k]); return o; };

  /* The scene. All coordinates are scene units; the camera orbits the tower. */
  function build() {
    V = []; seed = 7;
    const th = THEMES[isDark() ? 'dark' : 'light'];
    PAL = {}; for (const k in th.pal) PAL[k] = th.pal[k].map(hex);
    const S0 = [0, 0, 0, 0], spin = (cx, cz, w) => [1, cx, cz, w];

    /* Central station: two stacked stones, a fluted tower flaring at the crown, a dish and a cross. */
    loft(0, 0, [[-4, 15], [0, 15]], 28, 'stone', 0, S0);
    loft(0, 0, [[0, 9.5], [2.4, 9.5]], 28, 'stone', 0, S0);
    loft(0, 0, [[2.4, 2.6], [12, 2.1], [24, 1.6], [31, 1.8], [34, 3.2], [36, 5]], 12, 'flute', 0.2, S0);
    loft(0, 0, [[36, 0.4], [37.4, 3.8], [38.6, 6.4]], 16, 'stone', 0, S0);
    box(0, 41, 0, 0.45, 5, 0.45, 'stone', 0, S0);
    box(0, 42, 0, 2.6, 0.45, 0.45, 'stone', 0, S0);
    /* Things that turn: a ring of slabs, and a planet on its deferent. */
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      box(Math.cos(a) * 8.5, 24, Math.sin(a) * 8.5, 3.6, 0.6, 1.2, 'flute', -a + Math.PI / 2, spin(0, 0, 0.28));
    }
    solid(11.5, 31, 0, ICO(1.6), 'red', spin(0, 0, -0.5));

    /* A red strip hanging from the tower's ledge, folds alternating in tone. */
    for (let i = 0; i < 9; i++) {
      const y0 = 32 - i * 1.7, y1 = y0 - 1.7, x0 = 2.4 + (i % 2) * 0.7, x1 = 2.4 + ((i + 1) % 2) * 0.7;
      quad([x0, y0, -0.6], [x0, y0, 0.6], [x1, y1, 0.6], [x1, y1, -0.6], 'red', [0, y0, 20], S0);
    }

    /* Left: a ziggurat of stone discs on its own plinth. */
    loft(-26, 8, [[-3, 7.5], [0, 7.5]], 20, 'stone', 0, S0);
    [[7, 1.5], [5.6, 1.5], [4.2, 1.5], [2.8, 1.5]].forEach(([r, h], i) => loft(-26, 8, [[i * h, r], [i * h + h, r]], 20, 'stone', 0, S0));

    /* Right: three cubes in a row, a free wall at 15 degrees, a cross-cut slab. */
    loft(24, -4, [[-3, 9], [0, 9]], 4, 'stone', Math.PI / 4, S0);
    for (let i = 0; i < 3; i++) box(20 + i * 5, 3, -4, 4.4, 6, 4.4, 'stone', 0, S0);
    box(22.5, 4, -9, 14, 8, 0.8, 'stone', (15 * Math.PI) / 180, S0);
    box(22.5, 12, -8, 0.5, 4, 0.5, 'red', 0, S0);

    /* Back: a mountain of pitched houses on a mound, a monolith, an obelisk balanced on its point. */
    loft(-8, -26, [[-3, 9], [0, 9], [5, 4]], 14, 'stone', 0, S0);
    for (let i = 0; i < 16; i++) {
      const a = rnd() * Math.PI * 2, d = rnd() * 6, h = 5 - d * 0.7 + 0.6, x = -8 + Math.cos(a) * d, z = -26 + Math.sin(a) * d;
      const w = 1.4 + rnd() * 0.8, hh = 1.6 + rnd() * 1.2;
      box(x, h + hh / 2, z, w, hh, w, 'stone', a, S0);
      loft(x, z, [[h + hh, w * 0.78], [h + hh + 1.1, 0]], 4, 'red', a + Math.PI / 4, S0);
    }
    box(12, 6, -24, 3, 12, 3, 'flute', 0.3, S0);
    for (let i = 0; i < 4; i++) box(12 + 1.55 * Math.cos(0.3 + Math.PI / 2 * i) , 3 + i * 2.6, -24 - 1.55 * Math.sin(0.3 + Math.PI / 2 * i), 0.2, 0.7, 0.8, 'red', 0.3, S0);
    loft(-30, -10, [[8, 0], [9.4, 1.4], [20, 1.4], [23, 0]], 4, 'flute', 0.4, S0);

    /* Floating solids, turning slowly. */
    solid(34, 17, 16, OCTA(4.2), 'flute', spin(34, 16, 0.35));
    solid(-34, 14, 20, ICO(3.6), 'flute', spin(-34, 20, -0.3));
    solid(4, 52, -30, OCTA(2.4), 'red', spin(4, -30, 0.6));

    /* The sun: unshaded, drawn as an octagon in the camera's plane (see the vertex shader). */
    const disc = (r, mode, mat) => { for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, b = ((i + 1) / 8) * Math.PI * 2, col = PAL[mat][0];
      push([0, 0, 0], col, [mode, 0, 0, 0]); push([Math.cos(a) * r, Math.sin(a) * r, 0], col, [mode, 0, 0, 0]); push([Math.cos(b) * r, Math.sin(b) * r, 0], col, [mode, 0, 0, 0]);
    } };
    if (!isDark()) { PAL.halo = [th.halo, th.halo, th.halo]; disc(12.5, -2, 'halo'); }
    disc(9, -1, 'sun');
    return th;
  }

  /* ---------- shaders ---------- */
  const VS = `attribute vec3 p;attribute vec3 c;attribute vec4 s;
uniform mat4 M;uniform vec3 E,SC,SR,SU;uniform float T;varying vec3 C;varying float F;
void main(){
  vec3 q=p;float fog=1.;
  if(s.x>.5){float a=T*s.w,co=cos(a),si=sin(a);vec2 d=p.xz-s.yz;q.x=s.y+d.x*co+d.y*si;q.z=s.z-d.x*si+d.y*co;}
  else if(s.x<-.5){q=SC+SR*p.x+SU*p.y;fog=0.;if(s.x<-1.5)q+=normalize(SC-E)*2.;}
  gl_Position=M*vec4(q,1.);
  C=c;float d=length(q-E);F=fog*smoothstep(55.,150.,d);
  if(s.x<-.5){F=0.;}
}`;
  const FS = `precision mediump float;varying vec3 C;varying float F;uniform vec3 B;
void main(){gl_FragColor=vec4(mix(C,B,F),1.);}`;
  const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.bindAttribLocation(prog, 0, 'p'); gl.bindAttribLocation(prog, 1, 'c'); gl.bindAttribLocation(prog, 2, 's');
  gl.linkProgram(prog); gl.useProgram(prog);
  const U = n => gl.getUniformLocation(prog, n);
  const uM = U('M'), uE = U('E'), uSC = U('SC'), uSR = U('SR'), uSU = U('SU'), uT = U('T'), uB = U('B');

  const buf = gl.createBuffer();
  let count = 0, sky = [0, 0, 0];
  function upload() {
    const th = build(); sky = th.sky;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(V), gl.STATIC_DRAW);
    count = V.length / 10;
    const st = 40;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, st, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, st, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, st, 24);
    gl.uniform3fv(uB, sky);
    const bg = '#' + sky.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
    html.style.setProperty('--gbg', bg);
  }
  upload();
  addEventListener('themechange', upload);
  mq.addEventListener('change', upload);

  /* ---------- camera ---------- */
  const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov / 2);
    return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]; };
  const look = (e, c, up) => {
    const z = norm(sub(e, c)), x = norm(cross(up, z)), y = cross(z, x);
    return { m: [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1], x, y, z };
  };
  const mul = (a, b) => { const o = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; };

  /* The buffer is sized once to the largest the window gets (capped), shown from the top, so toolbars never stretch it. */
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  function resize() {
    const w = Math.round(innerWidth * DPR), h = Math.round(innerHeight * DPR);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
  }
  addEventListener('resize', resize); resize();

  gl.enable(gl.DEPTH_TEST);
  let frames = 0, t0 = performance.now(), visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(frame); });

  function frame(now) {
    if (!visible) return;
    const t = (now - t0) / 1000, asp = cv.width / cv.height;
    const sy = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);   /* 0..1 down the page */
    const a = 0.55 + 0.14 * Math.sin(t * 0.07) + sy * 1.5;
    const R = asp < 1 ? 118 : 86 - sy * 10;
    const eye = [Math.sin(a) * R, 20 + sy * 18, Math.cos(a) * R], tgt = [0, 17 + sy * 6, 0];
    const L = look(eye, tgt, [0, 1, 0]);
    const M = mul(persp(asp < 1 ? 0.95 : 0.7, asp, 1, 400), L.m);
    /* Sun: fixed in the view, up-left of centre, far away. */
    const fwd = [-L.z[0], -L.z[1], -L.z[2]];
    const SC = [0, 1, 2].map(i => eye[i] + fwd[i] * 190 - L.x[i] * (asp < 1 ? 18 : 64) + L.y[i] * (asp < 1 ? 70 : 44));
    gl.uniformMatrix4fv(uM, false, M); gl.uniform3fv(uE, eye);
    gl.uniform3fv(uSC, SC); gl.uniform3fv(uSR, L.x); gl.uniform3fv(uSU, L.y); gl.uniform1f(uT, t);
    gl.clearColor(sky[0], sky[1], sky[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, count);
    if (++frames === 3) html.classList.add('glon');   /* the canvas stays hidden until a few steady frames */
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
