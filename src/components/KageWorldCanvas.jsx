import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function KageWorldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // --- Math & Helper Utilities ---
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const sat = (v) => clamp(v, 0, 1);
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (e0, e1, x) => {
      const t = sat((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };
    const TAU = Math.PI * 2;
    const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));

    function mulberry32(a) {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function noise2D(seed) {
      const rnd = mulberry32(seed),
        p = new Uint8Array(256),
        perm = new Uint8Array(512);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0,
          t = p[i];
        p[i] = p[j];
        p[j] = t;
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
      const G = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
      return function (x, y) {
        const xi = Math.floor(x),
          yi = Math.floor(y);
        const X = xi & 255,
          Y = yi & 255,
          xf = x - xi,
          yf = y - yi;
        const u = fade(xf),
          v = fade(yf);
        const g = (h, dx, dy) => {
          const q = G[h & 7];
          return q[0] * dx + q[1] * dy;
        };
        const aa = perm[perm[X] + Y],
          ab = perm[perm[X] + Y + 1];
        const ba = perm[perm[X + 1] + Y],
          bb = perm[perm[X + 1] + Y + 1];
        return lerp(
          lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u),
          lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u),
          v
        );
      };
    }

    function fbm(n, x, y, oct, lac, gain) {
      let a = 0.5,
        f = 1,
        s = 0,
        m = 0;
      for (let i = 0; i < (oct || 4); i++) {
        s += a * n(x * f, y * f);
        m += a;
        a *= gain || 0.5;
        f *= lac || 2;
      }
      return s / m;
    }

    // --- Canvas & Color Helpers ---
    function cvs(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }
    const hex = (r, g, b) => 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
    const hdr = (r, g, b) => new THREE.Color().setRGB(r, g, b);

    function fbmCanvas(W, H, seed, octaves, baseCells, contrast) {
      const out = cvs(W, H),
        o = out.getContext('2d');
      o.fillStyle = '#808080';
      o.fillRect(0, 0, W, H);
      let cells = baseCells || 3,
        alpha = 1;
      for (let i = 0; i < (octaves || 5); i++) {
        const n = cvs(cells, cells),
          nx = n.getContext('2d');
        const im = nx.createImageData(cells, cells),
          d = im.data,
          r = mulberry32(seed + i * 977);
        for (let k = 0; k < cells * cells; k++) {
          const v = 128 + (r() - 0.5) * 255 * (contrast || 1);
          d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = clamp(v, 0, 255);
          d[k * 4 + 3] = 255;
        }
        nx.putImageData(im, 0, 0);
        o.globalAlpha = alpha;
        o.globalCompositeOperation = i === 0 ? 'source-over' : 'overlay';
        o.imageSmoothingEnabled = true;
        o.imageSmoothingQuality = 'high';
        o.drawImage(n, 0, 0, W, H);
        cells *= 2;
        alpha *= 0.62;
      }
      o.globalAlpha = 1;
      o.globalCompositeOperation = 'source-over';
      return out;
    }

    function normalFromHeight(hc, strength) {
      const W = hc.width,
        H = hc.height;
      const b = cvs(W, H),
        bx = b.getContext('2d');
      bx.filter = 'blur(1.1px)';
      bx.drawImage(hc, 0, 0);
      bx.filter = 'none';
      const src = bx.getImageData(0, 0, W, H).data;
      const out = cvs(W, H),
        ox = out.getContext('2d');
      const im = ox.createImageData(W, H),
        d = im.data;
      const at = (x, y) => src[(((y + H) % H) * W + ((x + W) % W)) * 4] / 255;
      const s = strength || 2.4;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const gx = (at(x + 1, y) - at(x - 1, y)) * s;
          const gy = (at(x, y + 1) - at(x, y - 1)) * s;
          let nx = -gx,
            ny = gy,
            nz = 1;
          const il = 1 / Math.hypot(nx, ny, nz);
          const i = (y * W + x) * 4;
          d[i] = (nx * il * 0.5 + 0.5) * 255;
          d[i + 1] = (ny * il * 0.5 + 0.5) * 255;
          d[i + 2] = (nz * il * 0.5 + 0.5) * 255;
          d[i + 3] = 255;
        }
      ox.putImageData(im, 0, 0);
      return out;
    }

    // --- Texture Generators ---
    function texWall() {
      const W = 1024,
        H = 1024;
      const c = cvs(W, H),
        x = c.getContext('2d');
      x.fillStyle = '#10161a';
      x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'overlay';
      x.globalAlpha = 0.82;
      x.drawImage(fbmCanvas(W, H, 41, 6, 3, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = 'source-over';

      const rnd = mulberry32(7);
      for (let i = 1; i < 6; i++) {
        const y = (H / 6) * i;
        x.fillStyle = 'rgba(0,0,0,.45)';
        x.fillRect(0, y - 1.5, W, 3);
        x.fillStyle = 'rgba(190,205,205,.05)';
        x.fillRect(0, y + 2, W, 2);
      }
      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 4; j++) {
          const cx2 = (W / 4) * (j + 0.5) + (rnd() - 0.5) * 14,
            cy = (H / 6) * (i + 0.5);
          const g = x.createRadialGradient(cx2, cy, 1, cx2, cy, 11);
          g.addColorStop(0, 'rgba(0,0,0,.5)');
          g.addColorStop(0.7, 'rgba(0,0,0,.18)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = g;
          x.beginPath();
          x.arc(cx2, cy, 11, 0, TAU);
          x.fill();
        }
      const h = cvs(W, H),
        hx = h.getContext('2d');
      hx.fillStyle = '#808080';
      hx.fillRect(0, 0, W, H);
      hx.globalAlpha = 0.5;
      hx.drawImage(fbmCanvas(W, H, 41, 5, 6, 1), 0, 0);
      hx.globalAlpha = 1;
      for (let i = 1; i < 6; i++) {
        hx.fillStyle = '#2a2a2a';
        hx.fillRect(0, (H / 6) * i - 2, W, 4);
      }
      return { map: c, normal: normalFromHeight(h, 2.0) };
    }

    function texFloor() {
      const W = 1024,
        H = 1024;
      const c = cvs(W, H),
        x = c.getContext('2d');
      const rnd = mulberry32(23);
      x.fillStyle = '#0a0f12';
      x.fillRect(0, 0, W, H);
      const N = 4,
        S = W / N;
      for (let j = 0; j < N; j++)
        for (let i = 0; i < N; i++) {
          const t = 0.82 + rnd() * 0.36;
          x.fillStyle = hex(12 * t, 17 * t, 20 * t);
          x.fillRect(i * S + 1.5, j * S + 1.5, S - 3, S - 3);
        }
      x.globalCompositeOperation = 'overlay';
      x.globalAlpha = 0.55;
      x.drawImage(fbmCanvas(W, H, 63, 6, 4, 1), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = 'source-over';
      x.strokeStyle = 'rgba(0,0,0,.72)';
      x.lineWidth = 3;
      for (let i = 0; i <= N; i++) {
        x.beginPath();
        x.moveTo(i * S, 0);
        x.lineTo(i * S, H);
        x.stroke();
        x.beginPath();
        x.moveTo(0, i * S);
        x.lineTo(W, i * S);
        x.stroke();
      }
      const h = cvs(W, H),
        hx = h.getContext('2d');
      hx.fillStyle = '#8c8c8c';
      hx.fillRect(0, 0, W, H);
      hx.globalAlpha = 0.35;
      hx.drawImage(fbmCanvas(W, H, 63, 5, 8, 1), 0, 0);
      hx.globalAlpha = 1;
      const r = cvs(512, 512),
        rx = r.getContext('2d');
      rx.fillStyle = '#1c1c1c';
      rx.fillRect(0, 0, 512, 512);
      rx.globalAlpha = 0.95;
      rx.globalCompositeOperation = 'lighten';
      rx.drawImage(fbmCanvas(512, 512, 77, 4, 3, 1.5), 0, 0);
      rx.globalAlpha = 1;
      rx.globalCompositeOperation = 'source-over';
      return { map: c, normal: normalFromHeight(h, 1.5), rough: r };
    }

    function texWood(seed, opt) {
      const o = opt || {},
        W = 512,
        H = 512;
      const c = cvs(W, H),
        x = c.getContext('2d');
      const h = cvs(W, H),
        hx = h.getContext('2d');
      const r = cvs(W, H),
        rx = r.getContext('2d');
      const rnd = mulberry32(seed || 3);
      const base = o.base || [30, 23, 19];
      x.fillStyle = hex(base[0], base[1], base[2]);
      x.fillRect(0, 0, W, H);
      hx.fillStyle = '#808080';
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = o.rough || '#d6d6d6';
      rx.fillRect(0, 0, W, H);

      const nb = o.boards === undefined ? 7 : o.boards;
      const cuts = [0];
      if (nb > 0) {
        const ws = [];
        let sum = 0;
        for (let i = 0; i < nb; i++) {
          const v = 0.7 + rnd() * 0.6;
          ws.push(v);
          sum += v;
        }
        let acc = 0;
        ws.forEach((v) => {
          acc += (v / sum) * W;
          cuts.push(acc);
        });
      } else cuts.push(W);

      for (let b = 0; b < cuts.length - 1; b++) {
        const x0 = cuts[b],
          x1 = cuts[b + 1],
          bw = x1 - x0;
        const tone = 0.8 + rnd() * 0.44;
        [x, hx, rx].forEach((d) => {
          d.save();
          d.beginPath();
          d.rect(x0, 0, bw, H);
          d.clip();
        });
        x.fillStyle = hex(base[0] * tone, base[1] * tone, base[2] * tone);
        x.fillRect(x0, 0, bw, H);
        [x, hx, rx].forEach((d) => d.restore());
      }
      return { map: c, normal: normalFromHeight(h, o.relief || 2.4), rough: r };
    }

    function texStone(seed, opt) {
      const o = opt || {},
        W = 512,
        H = 512;
      const c = cvs(W, H),
        x = c.getContext('2d');
      const h = cvs(W, H),
        hx = h.getContext('2d');
      const r = cvs(W, H),
        rx = r.getContext('2d');
      const rnd = mulberry32(seed || 17);
      const base = o.base || [46, 51, 53];
      x.fillStyle = hex(base[0], base[1], base[2]);
      x.fillRect(0, 0, W, H);
      hx.fillStyle = '#808080';
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = '#e8e8e8';
      rx.fillRect(0, 0, W, H);
      return { map: c, normal: normalFromHeight(h, o.relief || 3.2), rough: r };
    }

    function texLacquer() {
      const W = 512,
        H = 512;
      const wood = texWood(131, { base: [34, 22, 17], boards: 0 });
      const c = cvs(W, H),
        x = c.getContext('2d');
      const h = cvs(W, H),
        hx = h.getContext('2d');
      const r = cvs(W, H),
        rx = r.getContext('2d');
      x.drawImage(wood.map, 0, 0);
      hx.fillStyle = '#808080';
      hx.fillRect(0, 0, W, H);
      rx.fillStyle = '#8c8c8c';
      rx.fillRect(0, 0, W, H);
      x.globalAlpha = 0.8;
      x.fillStyle = '#7c1610';
      x.fillRect(0, 0, W, H);
      x.globalAlpha = 1;
      return { map: c, normal: normalFromHeight(h, 2.2), rough: r };
    }

    function texShoji() {
      const W = 1024,
        H = 768,
        c = cvs(W, H),
        x = c.getContext('2d');
      x.clearRect(0, 0, W, H);
      x.fillStyle = 'rgba(228,222,206,.055)';
      x.fillRect(0, 0, W, H);
      x.strokeStyle = 'rgba(10,8,7,.88)';
      const cols = 12,
        rows = 9;
      x.lineWidth = 5;
      for (let i = 1; i < cols; i++) {
        x.beginPath();
        x.moveTo((W / cols) * i, 0);
        x.lineTo((W / cols) * i, H);
        x.stroke();
      }
      for (let j = 1; j < rows; j++) {
        x.beginPath();
        x.moveTo(0, (H / rows) * j);
        x.lineTo(W, (H / rows) * j);
        x.stroke();
      }
      x.lineWidth = 13;
      x.strokeStyle = 'rgba(8,6,5,.95)';
      x.strokeRect(0, 0, W, H);
      x.beginPath();
      x.moveTo(W / 2, 0);
      x.lineTo(W / 2, H);
      x.stroke();
      return c;
    }

    function texLeaf() {
      const S = 128,
        c = cvs(S, S),
        x = c.getContext('2d');
      x.translate(S / 2, S * 0.92);
      x.scale(S / 2.2, -S / 2.2);
      x.beginPath();
      const lobes = 5,
        spread = 1.9;
      for (let i = 0; i < lobes; i++) {
        const a = -spread / 2 + spread * (i / (lobes - 1)) + Math.PI / 2;
        const len = i === 2 ? 0.96 : i === 1 || i === 3 ? 0.82 : 0.6;
        const wob = 0.17;
        x.moveTo(0, 0.02);
        x.lineTo(Math.cos(a - wob) * len * 0.55, Math.sin(a - wob) * len * 0.55);
        x.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        x.lineTo(Math.cos(a + wob) * len * 0.55, Math.sin(a + wob) * len * 0.55);
        x.closePath();
      }
      x.fillStyle = '#fff';
      x.fill();
      x.lineWidth = 0.05;
      x.strokeStyle = '#fff';
      x.stroke();
      return c;
    }

    function texRoof() {
      const W = 512,
        H = 512,
        c = cvs(W, H),
        x = c.getContext('2d');
      const h = cvs(W, H),
        hx = h.getContext('2d');
      x.fillStyle = '#151c20';
      x.fillRect(0, 0, W, H);
      hx.fillStyle = '#606060';
      hx.fillRect(0, 0, W, H);
      const ribs = 14,
        s = W / ribs;
      for (let i = 0; i < ribs; i++) {
        const g = x.createLinearGradient(i * s, 0, (i + 1) * s, 0);
        g.addColorStop(0, 'rgba(0,0,0,.62)');
        g.addColorStop(0.3, 'rgba(148,178,192,.13)');
        g.addColorStop(0.66, 'rgba(84,110,124,.05)');
        g.addColorStop(1, 'rgba(0,0,0,.62)');
        x.fillStyle = g;
        x.fillRect(i * s, 0, s, H);

        const hg = hx.createLinearGradient(i * s, 0, (i + 1) * s, 0);
        hg.addColorStop(0, '#2c2c2c');
        hg.addColorStop(0.5, '#eaeaea');
        hg.addColorStop(1, '#2c2c2c');
        hx.fillStyle = hg;
        hx.fillRect(i * s, 0, s, H);
      }
      return { map: c, normal: normalFromHeight(h, 2.2) };
    }

    function texSky() {
      const W = 512,
        H = 512,
        c = cvs(W, H),
        x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgb(6,10,15)');
      g.addColorStop(0.34, 'rgb(13,22,31)');
      g.addColorStop(0.66, 'rgb(17,26,34)');
      g.addColorStop(0.88, 'rgb(24,35,42)');
      g.addColorStop(1, 'rgb(14,22,28)');
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
      x.globalAlpha = 0.34;
      x.globalCompositeOperation = 'overlay';
      x.drawImage(fbmCanvas(W, H, 313, 5, 3, 0.9), 0, 0);
      x.globalAlpha = 1;
      x.globalCompositeOperation = 'source-over';
      const wg = x.createRadialGradient(W * 0.68, H * 0.95, 4, W * 0.68, H * 0.95, W * 0.44);
      wg.addColorStop(0, 'rgba(150,66,26,.30)');
      wg.addColorStop(0.5, 'rgba(96,44,22,.12)');
      wg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = wg;
      x.fillRect(0, 0, W, H);
      const rnd = mulberry32(881);
      for (let i = 0; i < 520; i++) {
        const sx = rnd() * W,
          sy = rnd() * H * 0.78,
          r = 0.5 + rnd() * rnd() * 1.8;
        x.fillStyle = 'rgba(214,232,240,' + (0.15 + rnd() * 0.45) * (1 - sy / H) + ')';
        x.beginPath();
        x.arc(sx, sy, r, 0, TAU);
        x.fill();
      }
      return c;
    }

    function texRidge() {
      const W = 2048,
        H = 512,
        c = cvs(W, H),
        x = c.getContext('2d');
      const n = noise2D(1207);
      x.beginPath();
      x.moveTo(0, H);
      for (let i = 0; i <= W; i += 4) {
        const t = i / W;
        const ridge =
          0.46 +
          0.3 * (fbm(n, t * 2.4, 0.5, 4, 2.1, 0.55) * 0.5 + 0.5) +
          0.16 * (fbm(n, t * 7.5, 3.1, 3, 2.2, 0.5) * 0.5 + 0.5);
        x.lineTo(i, H - ridge * H * 0.84);
      }
      x.lineTo(W, H);
      x.closePath();
      x.fillStyle = '#050809';
      x.fill();
      return c;
    }

    function texGlow(inner, mid) {
      const S = 256,
        c = cvs(S, S),
        x = c.getContext('2d');
      const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      g.addColorStop(0, inner || 'rgba(255,255,255,1)');
      g.addColorStop(0.28, mid || 'rgba(255,255,255,.36)');
      g.addColorStop(0.62, 'rgba(255,255,255,.07)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, S, S);
      return c;
    }

    function texMoon() {
      const S = 512,
        c = cvs(S, S),
        x = c.getContext('2d');
      const R = S / 2 - 1,
        rnd = mulberry32(91);
      const px = (u, v) => [S / 2 + u * R, S / 2 + v * R];

      x.beginPath();
      x.arc(S / 2, S / 2, R, 0, TAU);
      x.closePath();
      x.save();
      x.clip();

      const g = x.createRadialGradient(S * 0.46, S * 0.44, S * 0.05, S / 2, S / 2, R);
      g.addColorStop(0, 'rgb(150,150,150)');
      g.addColorStop(0.55, 'rgb(158,158,158)');
      g.addColorStop(0.86, 'rgb(178,178,178)');
      g.addColorStop(1, 'rgb(196,196,196)');
      x.fillStyle = g;
      x.fillRect(0, 0, S, S);

      const seas = [
        [-0.52, -0.06, 0.46, 0.8],
        [-0.26, -0.38, 0.31, 0.92],
        [0.13, -0.31, 0.2, 0.88],
        [0.3, -0.08, 0.23, 0.84],
        [0.45, 0.12, 0.15, 0.78],
        [0.27, 0.27, 0.12, 0.74],
        [0.57, -0.3, 0.12, 0.95],
        [-0.27, 0.3, 0.19, 0.7],
        [-0.47, 0.25, 0.13, 0.72],
      ];
      const sea = cvs(S, S),
        sx = sea.getContext('2d');
      seas.forEach(([u, v, rad, dk]) => {
        for (let i = 0; i < 22; i++) {
          const a = rnd() * TAU,
            off = rnd() * rad * 0.66;
          const [bx, by] = px(u + Math.cos(a) * off, v + Math.sin(a) * off * 0.8);
          const rr = rad * R * (0.3 + rnd() * 0.46);
          const bg = sx.createRadialGradient(bx, by, rr * 0.2, bx, by, rr);
          bg.addColorStop(0, 'rgba(0,0,0,' + (dk * 0.14).toFixed(3) + ')');
          bg.addColorStop(1, 'rgba(0,0,0,0)');
          sx.fillStyle = bg;
          sx.beginPath();
          sx.arc(bx, by, rr, 0, TAU);
          sx.fill();
        }
      });
      x.save();
      x.filter = 'blur(9px)';
      x.globalAlpha = 0.9;
      x.drawImage(sea, 0, 0);
      x.restore();
      x.restore();
      return c;
    }

    // --- WebGL Setup ---
    const vpW = () => document.documentElement.clientWidth || window.innerWidth;
    const vpH = () => document.documentElement.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(vpW(), vpH(), true);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x05070a, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a0e, 0.0168);
    scene.background = new THREE.Color(0x060a0d);

    const camera = new THREE.PerspectiveCamera(36, vpW() / vpH(), 0.35, 220);
    scene.add(camera);

    const tx = (canvasEl, o) => {
      o = o || {};
      const t = new THREE.CanvasTexture(canvasEl);
      t.wrapS = t.wrapT = o.wrap || THREE.ClampToEdgeWrapping;
      if (o.repeat) t.repeat.set(o.repeat[0], o.repeat[1]);
      if (o.srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
      return t;
    };

    const LIB = {};
    const lib = (k, f) => LIB[k] || (LIB[k] = f());
    const wallWood = () => lib('wallWood', () => texWood(3, { boards: 7 }));
    const postWood = () => lib('postWood', () => texWood(29, { boards: 0 }));

    function surface(t, rep, o) {
      o = o || {};
      const wrap = THREE.RepeatWrapping;
      const m = new THREE.MeshStandardMaterial({
        map: tx(t.map, { wrap: wrap, repeat: rep }),
        normalMap: tx(t.normal, { wrap: wrap, repeat: rep, srgb: false }),
        normalScale: new THREE.Vector2(
          o.normal === undefined ? 0.8 : o.normal,
          o.normal === undefined ? 0.8 : o.normal
        ),
        color: o.color === undefined ? 0xffffff : o.color,
        roughness: o.roughness === undefined ? 1 : o.roughness,
        metalness: o.metalness === undefined ? 0.02 : o.metalness,
      });
      if (t.rough) m.roughnessMap = tx(t.rough, { wrap: wrap, repeat: rep, srgb: false });
      return m;
    }

    function sweepPoly(points, profile) {
      const segs = points.length,
        np = profile.length;
      const pos = [],
        nor = [],
        uv = [],
        idx = [];
      const T = new THREE.Vector3(),
        N = new THREE.Vector3(),
        B = new THREE.Vector3(),
        up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < segs; i++) {
        const p = points[i],
          a = points[Math.max(0, i - 1)],
          b = points[Math.min(segs - 1, i + 1)];
        T.subVectors(b, a).normalize();
        B.crossVectors(T, up).normalize();
        N.crossVectors(B, T).normalize();
        for (let j = 0; j < np; j++) {
          const u = profile[j][0],
            v = profile[j][1],
            l = Math.hypot(u, v) || 1;
          pos.push(p.x + B.x * u + N.x * v, p.y + B.y * u + N.y * v, p.z + B.z * u + N.z * v);
          nor.push((B.x * u) / l + (N.x * v) / l, (B.y * u) / l + (N.y * v) / l, (B.z * u) / l + (N.z * v) / l);
          uv.push(j / np, i / (segs - 1));
        }
      }
      for (let i = 0; i < segs - 1; i++)
        for (let j = 0; j < np; j++) {
          const j2 = (j + 1) % np,
            a = i * np + j,
            b = i * np + j2,
            c = (i + 1) * np + j2,
            d = (i + 1) * np + j;
          idx.push(a, b, c, a, c, d);
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    }

    function roofGeo(A, B, R, Hr, thick, flare) {
      const NX = 52,
        NZ = 34,
        FL = flare === undefined ? 0.3 : flare,
        e = 1e-3;
      const hAt = (x, z) => {
        const cx = Math.min(1, Math.abs(x) / A),
          cz = Math.min(1, Math.abs(z) / B);
        const tx = Math.max(0, (Math.abs(x) - R) / Math.max(A - R, 1e-4));
        const t = Math.min(1, Math.max(tx, cz));
        return (
          Hr * Math.pow(1 - t, 1.45) +
          FL * Hr * smooth(0.72, 1, t) * (0.52 + 0.68 * Math.min(cx, cz))
        );
      };
      const pos = [],
        nor = [],
        uv = [],
        idx = [];
      const N = new THREE.Vector3();
      const VPS = (NX + 1) * (NZ + 1);
      for (let k = 0; k < 2; k++) {
        for (let j = 0; j <= NZ; j++)
          for (let i = 0; i <= NX; i++) {
            const x = -A + (2 * A * i) / NX,
              z = -B + (2 * B * j) / NZ;
            N.set(
              -(hAt(x + e, z) - hAt(x - e, z)) / (2 * e),
              1,
              -(hAt(x, z + e) - hAt(x, z - e)) / (2 * e)
            ).normalize();
            if (k) N.negate();
            pos.push(x, hAt(x, z) - (k ? thick : 0), z);
            nor.push(N.x, N.y, N.z);
            uv.push(x * 0.14, z * 0.14);
          }
        for (let j = 0; j < NZ; j++)
          for (let i = 0; i < NX; i++) {
            const a = k * VPS + j * (NX + 1) + i,
              b = a + 1,
              c = a + NX + 2,
              d = a + NX + 1;
            k ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d);
          }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    }

    // --- Build Environment Shell ---
    const PODIUM = 7.0;
    const TEMPLE_Z = -44;

    const wallT = texWall();
    const wallMap = tx(wallT.map, { wrap: THREE.RepeatWrapping, repeat: [4, 1.4] });
    const wallNrm = tx(wallT.normal, { wrap: THREE.RepeatWrapping, repeat: [4, 1.4], srgb: false });
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallMap,
      normalMap: wallNrm,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.78,
      metalness: 0.05,
      color: 0x525c60,
    });

    const sky = new THREE.Mesh(
      new THREE.PlaneGeometry(360, 190),
      new THREE.MeshBasicMaterial({
        color: hdr(0.6, 0.7, 0.8),
        map: tx(texSky()),
        depthWrite: false,
        fog: false,
      })
    );
    sky.position.set(0, 62, -108);
    scene.add(sky);

    const ridgeMap = tx(texRidge(), { wrap: THREE.RepeatWrapping, repeat: [1.7, 1] });
    [
      [-90, 13, 300, 26, 0],
      [-63, 9.5, 210, 19, 16],
    ].forEach((r, i) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(r[2], r[3]),
        new THREE.MeshBasicMaterial({
          map: i ? tx(texRidge()) : ridgeMap,
          transparent: true,
          color: i ? 0x0a1015 : 0x06090d,
          depthWrite: false,
          fog: false,
        })
      );
      m.position.set(r[4], r[1], r[0]);
      scene.add(m);
    });

    const fT = texFloor();
    const floorMat = new THREE.MeshStandardMaterial({
      map: tx(fT.map, { wrap: THREE.RepeatWrapping, repeat: [7, 7] }),
      normalMap: tx(fT.normal, { wrap: THREE.RepeatWrapping, repeat: [7, 7], srgb: false }),
      roughnessMap: tx(fT.rough, { wrap: THREE.RepeatWrapping, repeat: [3.4, 3.4], srgb: false }),
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughness: 0.74,
      metalness: 0.06,
      color: 0x69757a,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -18);
    scene.add(floor);

    const platMat = new THREE.MeshStandardMaterial({
      map: tx(fT.map, { wrap: THREE.RepeatWrapping, repeat: [3, 1.2] }),
      normalMap: tx(fT.normal, { wrap: THREE.RepeatWrapping, repeat: [3, 1.2], srgb: false }),
      normalScale: new THREE.Vector2(0.18, 0.18),
      roughness: 0.93,
      metalness: 0.02,
      color: 0x58636a,
    });
    const plat = new THREE.Mesh(new THREE.BoxGeometry(42, PODIUM, 24), platMat);
    plat.position.set(0, PODIUM / 2, -45);
    scene.add(plat);

    // --- Build Temple Worship Hall ---
    const templeGroup = new THREE.Group();
    const timber = surface(wallWood(), [4, 1.6], { color: 0x565150, normal: 1.5 });
    const post = surface(postWood(), [1.1, 1.0], { color: 0x8a746d, normal: 1.05, metalness: 0.03 });
    const tileMat = surface(lib('roof', () => texRoof()), [1, 1], {
      color: 0x2b343a,
      roughness: 0.74,
      metalness: 0.1,
      normal: 1.4,
    });
    const paper = new THREE.MeshBasicMaterial({ color: hdr(1.06, 0.48, 0.18), fog: true });
    const grid = new THREE.MeshBasicMaterial({
      map: tx(texShoji()),
      transparent: true,
      depthWrite: false,
      fog: true,
    });

    function bay(w, h, x, y, z) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), paper);
      p.position.set(x, y, z);
      templeGroup.add(p);
      const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), grid);
      s.position.set(x, y, z + 0.06);
      templeGroup.add(s);
    }

    const F = PODIUM;
    const core = new THREE.Mesh(new THREE.BoxGeometry(13.6, 5.0, 8.2), timber);
    core.position.set(0, F + 2.5, TEMPLE_Z);
    templeGroup.add(core);

    for (let i = 0; i < 5; i++) {
      const x = -5.6 + i * 2.8;
      bay(1.55, 2.5, x, F + 2.6, TEMPLE_Z + 4.16);
    }
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 5.0, 14), post);
      c.position.set(-7.0 + i * 2.8, F + 2.5, TEMPLE_Z + 4.24);
      templeGroup.add(c);
    }

    const lower = new THREE.Mesh(roofGeo(9.6, 6.4, 3.2, 2.9, 0.4, 0.26), tileMat);
    lower.position.set(0, F + 5.6, TEMPLE_Z);
    templeGroup.add(lower);

    const up = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.4, 6.0), timber);
    up.position.set(0, F + 9.4, TEMPLE_Z);
    templeGroup.add(up);

    const upper = new THREE.Mesh(roofGeo(10.8, 7.2, 3.6, 5.2, 0.48, 0.26), tileMat);
    upper.position.set(0, F + 11.7, TEMPLE_Z);
    templeGroup.add(upper);

    scene.add(templeGroup);

    // --- Build Weathered Vermilion Torii Gate ---
    const lac = surface(lib('lacquer', () => texLacquer()), [2, 2], {
      color: hdr(1.72, 1.02, 0.94),
      roughness: 0.92,
      metalness: 0.05,
      normal: 0.75,
    });
    const gold = new THREE.MeshStandardMaterial({ color: 0x7a5d2a, roughness: 0.5, metalness: 0.6 });
    const toriiGroup = new THREE.Group();
    const BASE = 0.78,
      TH = 8.2,
      SPAN = 3.55;

    [-1, 1].forEach((s) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, TH, 26), lac);
      col.position.set(s * SPAN, BASE + TH / 2, 0);
      toriiGroup.add(col);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.52, 26), gold);
      foot.position.set(s * SPAN, BASE + 0.26, 0);
      toriiGroup.add(foot);
    });

    const nuki = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.52, 0.46), lac);
    nuki.position.set(0, BASE + TH - 2.15, 0);
    toriiGroup.add(nuki);

    function beamPath(half, rise, power) {
      const p = [];
      for (let i = 0; i <= 26; i++) {
        const u = (i / 26) * 2 - 1;
        p.push(new THREE.Vector3(u * half, Math.pow(Math.abs(u), power) * rise, 0));
      }
      return p;
    }
    const shimaki = new THREE.Mesh(
      sweepPoly(beamPath(5.05, 0.4, 2.6), [
        [-0.3, -0.19],
        [0.3, -0.19],
        [0.32, 0.06],
        [0.28, 0.21],
        [-0.28, 0.21],
        [-0.32, 0.06],
      ]),
      lac
    );
    shimaki.position.set(0, BASE + TH - 0.52, 0);
    toriiGroup.add(shimaki);

    const kasagi = new THREE.Mesh(
      sweepPoly(beamPath(5.85, 0.62, 2.4), [
        [-0.42, -0.24],
        [0.42, -0.24],
        [0.46, 0.04],
        [0.3, 0.28],
        [-0.3, 0.28],
        [-0.46, 0.04],
      ]),
      lac
    );
    kasagi.position.set(0, BASE + TH + 0.96, 0);
    toriiGroup.add(kasagi);

    const GS = 0.72;
    toriiGroup.position.set(0, -BASE * GS, -8.6);
    toriiGroup.scale.setScalar(GS);
    scene.add(toriiGroup);

    // --- Build Stone Lanterns ---
    function buildLantern(x, z, s) {
      const stone = lib('graniteMat', () =>
        surface(lib('granite', () => texStone(17)), [1.5, 1.5], { color: 0x9aa5a5, metalness: 0, normal: 1.45 })
      );
      const dark = lib('lanternDark', () => surface(postWood(), [0.9, 0.9], { color: 0xd8c2b6, metalness: 0.1, normal: 0.7 }));
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.26, 20), stone);
      base.position.y = 0.13;
      g.add(base);
      const postMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.02, 16), stone);
      postMesh.position.y = 0.77;
      g.add(postMesh);
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), dark);
      box.position.y = 1.66;
      g.add(box);

      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshBasicMaterial({
          map: tx(texGlow('rgba(255,120,60,.9)', 'rgba(255,60,24,.28)')),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
          opacity: 0.5,
        })
      );
      glow.position.y = 1.66;
      g.add(glow);

      const lt = new THREE.PointLight(0xff5a24, 2.6, 9, 2);
      lt.position.set(0, 1.66, 0);
      g.add(lt);

      const roofMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.62, 0.34, 4, 1), stone);
      roofMesh.position.y = 2.06;
      roofMesh.rotation.y = Math.PI / 4;
      g.add(roofMesh);

      g.position.set(x, 0, z);
      g.scale.setScalar(s || 1);
      scene.add(g);
      return g;
    }

    [
      [-5.2, 5.2, 1.05],
      [5.2, 5.2, 1.05],
      [-6.4, -4.2, 1.15],
      [6.4, -4.2, 1.15],
      [-7.8, -14.0, 1.25],
      [7.8, -14.0, 1.25],
    ].forEach((l) => buildLantern(l[0], l[1], l[2]));

    // --- Build Swaying Japanese Maple Trees ---
    function buildMaple(seed, x, z, scale) {
      const rnd = mulberry32(seed);
      const parts = [],
        tips = [];
      const M = new THREE.Matrix4(),
        Q = new THREE.Quaternion(),
        UP = new THREE.Vector3(0, 1, 0);
      const dir = new THREE.Vector3(),
        pos = new THREE.Vector3();

      function seg(from, to, r0, r1) {
        dir.subVectors(to, from);
        const len = dir.length();
        dir.normalize();
        const geo = new THREE.CylinderGeometry(r1, r0, len, 6, 1, true);
        Q.setFromUnitVectors(UP, dir);
        pos.addVectors(from, to).multiplyScalar(0.5);
        M.compose(pos, Q, new THREE.Vector3(1, 1, 1));
        geo.applyMatrix4(M);
        parts.push(geo);
      }
      function branch(from, dirV, len, rad, depth) {
        const to = from.clone().addScaledVector(dirV, len);
        to.y += len * 0.1;
        seg(from, to, rad, rad * 0.68);
        if (depth >= 4 || len < 0.34) {
          tips.push(to.clone());
          return;
        }
        const n = depth < 2 ? 3 : 2;
        for (let i = 0; i < n; i++) {
          const d = dirV.clone();
          d.x += (rnd() - 0.5) * 1.25;
          d.z += (rnd() - 0.5) * 1.25;
          d.y += 0.3 + rnd() * 0.5;
          d.normalize();
          branch(to, d, len * (0.62 + rnd() * 0.16), rad * 0.66, depth + 1);
        }
      }
      seg(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0), 0.22, 0.16);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + rnd();
        branch(new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(Math.cos(a) * 0.8, 0.8, Math.sin(a) * 0.8).normalize(), 1.45, 0.155, 0);
      }

      const leafGeo = new THREE.PlaneGeometry(0.36, 0.36);
      const leafMat = new THREE.MeshStandardMaterial({
        map: tx(texLeaf()),
        color: 0x2b0406,
        alphaTest: 0.42,
        side: THREE.DoubleSide,
        roughness: 0.86,
        metalness: 0,
        emissive: 0x080000,
        emissiveIntensity: 0.12,
      });

      const per = 7;
      const inst = new THREE.InstancedMesh(leafGeo, leafMat, tips.length * per);
      const m4 = new THREE.Matrix4(),
        e = new THREE.Euler(),
        q2 = new THREE.Quaternion(),
        sc = new THREE.Vector3();
      let k = 0;
      tips.forEach((t) => {
        for (let i = 0; i < per; i++) {
          const p = new THREE.Vector3(t.x + (rnd() - 0.5) * 0.95, t.y + (rnd() - 0.5) * 0.8, t.z + (rnd() - 0.5) * 0.95);
          e.set(rnd() * TAU, rnd() * TAU, rnd() * TAU);
          q2.setFromEuler(e);
          const s = 0.7 + rnd() * 0.75;
          sc.set(s, s, s);
          m4.compose(p, q2, sc);
          inst.setMatrixAt(k++, m4);
        }
      });
      inst.instanceMatrix.needsUpdate = true;
      const g = new THREE.Group();
      g.add(inst);
      g.position.set(x, 0, z);
      g.scale.setScalar(scale || 1);
      g.rotation.y = rnd() * TAU;
      scene.add(g);
      return g;
    }

    buildMaple(101, -11.5, -4.5, 1.4);
    buildMaple(202, 11.5, -4.5, 1.4);

    // --- Build Vermilion Blood Moon & Dual-Ring Corona Glow ---
    const MOON = { x: 17.9, y: 31.9, z: -72, r: 8.6 };
    const disc = new THREE.Mesh(
      new THREE.PlaneGeometry(MOON.r * 2, MOON.r * 2),
      new THREE.MeshBasicMaterial({
        map: tx(texMoon()),
        color: hdr(3.6, 0.64, 0.61),
        transparent: true,
        depthWrite: false,
        fog: false,
      })
    );
    disc.position.set(MOON.x, MOON.y, MOON.z);
    scene.add(disc);

    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(MOON.r * 6.4, MOON.r * 6.4),
      new THREE.MeshBasicMaterial({
        map: tx(texGlow('rgba(255,124,112,.90)', 'rgba(206,52,48,.26)')),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0.44,
      })
    );
    halo.position.set(MOON.x, MOON.y, MOON.z - 0.3);
    scene.add(halo);

    const haloOuter = new THREE.Mesh(
      new THREE.PlaneGeometry(MOON.r * 12.0, MOON.r * 12.0),
      new THREE.MeshBasicMaterial({
        map: tx(texGlow('rgba(255,80,60,.35)', 'rgba(180,30,20,.05)')),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0.28,
      })
    );
    haloOuter.position.set(MOON.x, MOON.y, MOON.z - 0.6);
    scene.add(haloOuter);

    const aspectFix = () => clamp((1.62 - vpW() / vpH()) / 1.05, 0, 1);
    const placeMoon = () => {
      const mx = MOON.x * (1 - 0.4 * aspectFix());
      disc.position.x = mx;
      halo.position.x = mx;
      haloOuter.position.x = mx;
    };
    placeMoon();

    // --- Ground Fog Haze Slabs ---
    const hazeTex = tx(texGlow('rgba(160,205,210,.55)', 'rgba(110,165,175,.18)'));
    const hazePlanes = [];
    const hazeRnd = mulberry32(66);
    for (let i = 0; i < 6; i++) {
      const s = 14 + hazeRnd() * 16;
      const h = new THREE.Mesh(
        new THREE.PlaneGeometry(s, s * 0.55),
        new THREE.MeshBasicMaterial({
          map: hazeTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
          opacity: 0.06 + hazeRnd() * 0.08,
        })
      );
      h.position.set((hazeRnd() - 0.5) * 44, 1.5 + hazeRnd() * 10, -38 + hazeRnd() * 40);
      scene.add(h);
      hazePlanes.push({ mesh: h, sp: 0.06 + hazeRnd() * 0.12, ph: hazeRnd() * TAU, x0: h.position.x });
    }

    // --- Falling Autumn Leaves System ---
    const LEAF_AHEAD = 11,
      LEAF_SPREAD = 12,
      LEAF_R = 30;
    const leafCount = 200;
    const leafMat = new THREE.MeshStandardMaterial({
      map: tx(texLeaf()),
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      color: 0x40080a,
      roughness: 0.84,
      metalness: 0,
      emissive: 0x780200,
      emissiveIntensity: 0.72,
    });
    const leafMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.4, 0.4), leafMat, leafCount);
    leafMesh.frustumCulled = false;
    const leafRnd = mulberry32(404),
      leavesList = [];
    for (let i = 0; i < leafCount; i++)
      leavesList.push({
        x: (leafRnd() - 0.5) * 2 * LEAF_R,
        z: (leafRnd() - 0.5) * 2 * LEAF_R,
        y: leafRnd() * 26,
        fall: 0.5 + leafRnd() * 0.9,
        sway: 0.45 + leafRnd() * 1.5,
        swayPh: leafRnd() * TAU,
        swayAmp: 0.3 + leafRnd() * 0.95,
        spin: (leafRnd() - 0.5) * 2.6,
        roll: leafRnd() * TAU,
        rollSp: 0.5 + leafRnd() * 2.0,
        tilt: leafRnd() * TAU,
        s: 0.55 + leafRnd() * 0.9,
      });
    scene.add(leafMesh);

    const LEAF_M = new THREE.Matrix4(),
      LEAF_Q = new THREE.Quaternion();
    const LEAF_E = new THREE.Euler(),
      LEAF_P = new THREE.Vector3(),
      LEAF_S = new THREE.Vector3();
    const LEAF_F = new THREE.Vector3();

    function updateLeaves(dt, elapsed) {
      const cy = camera.position.y;
      camera.getWorldDirection(LEAF_F);
      LEAF_F.y = 0;
      if (LEAF_F.lengthSq() < 1e-6) LEAF_F.set(0, 0, -1);
      else LEAF_F.normalize();
      const fx = camera.position.x + LEAF_F.x * LEAF_AHEAD;
      const fz = camera.position.z + LEAF_F.z * LEAF_AHEAD;

      for (let i = 0; i < leavesList.length; i++) {
        const l = leavesList[i];
        l.y -= l.fall * dt;
        l.roll += l.rollSp * dt;
        l.tilt += l.spin * dt;
        if (l.y < cy - 10) {
          l.y = cy + 16;
          const a = Math.random() * TAU,
            r = Math.sqrt(Math.random()) * LEAF_SPREAD;
          l.x = fx + Math.cos(a) * r;
          l.z = fz + Math.sin(a) * r;
        }
        const sw = Math.sin(elapsed * l.sway + l.swayPh);
        LEAF_P.set(l.x + sw * l.swayAmp, l.y, l.z + Math.cos(elapsed * l.sway * 0.7 + l.swayPh) * l.swayAmp * 0.6);
        LEAF_E.set(l.roll, l.tilt, sw * 0.55);
        LEAF_Q.setFromEuler(LEAF_E);
        LEAF_S.setScalar(l.s);
        LEAF_M.compose(LEAF_P, LEAF_Q, LEAF_S);
        leafMesh.setMatrixAt(i, LEAF_M);
      }
      leafMesh.instanceMatrix.needsUpdate = true;
    }

    // --- Particle Swarm ---
    const N = 500;
    const pos = new Float32Array(N * 3),
      seed = new Float32Array(N);
    const rnd = mulberry32(66);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() - 0.5) * 32;
      pos[i * 3 + 1] = rnd() * 12;
      pos[i * 3 + 2] = -26 + rnd() * 38;
      seed[i] = rnd();
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    bg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const emb = new THREE.Points(
      bg,
      new THREE.ShaderMaterial({
        uniforms: {
          uT: { value: 0 },
          uTex: { value: tx(texGlow('rgba(255,190,140,1)', 'rgba(255,120,60,.35)')) },
          uSize: { value: vpH() * 0.5 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          attribute float aSeed; uniform float uT; uniform float uSize; varying float vA;
          void main(){ vec3 p=position;
           p.y = mod(p.y + uT*(0.14+aSeed*0.28), 11.5);
           p.x += sin(uT*0.36 + aSeed*22.0)*0.85;
           p.z += cos(uT*0.29 + aSeed*17.0)*0.7;
           vec4 mv = modelViewMatrix * vec4(p,1.0);
           vA = (0.25+aSeed*0.75) * smoothstep(11.5,7.0,p.y) * smoothstep(0.0,1.4,p.y);
           gl_PointSize = uSize*(0.010+aSeed*0.020)/max(-mv.z,0.6);
           gl_Position = projectionMatrix * mv; }
        `,
        fragmentShader: `
          uniform sampler2D uTex; varying float vA;
          void main(){ vec4 t=texture2D(uTex, gl_PointCoord);
           gl_FragColor = vec4(t.rgb*vec3(1.6,0.78,0.42), t.a*vA*0.75); }
        `,
      })
    );
    scene.add(emb);

    // --- Lights ---
    scene.add(new THREE.HemisphereLight(0x53838f, 0x060a08, 0.15));
    const keyLight = new THREE.DirectionalLight(0xb6dbe4, 1.25);
    keyLight.position.set(2.6, 21, 2.5);
    scene.add(keyLight);

    const moonKey = new THREE.DirectionalLight(0xff6a42, 0.65);
    moonKey.position.set(26, 30, -60);
    scene.add(moonKey);

    const vermilionLight = new THREE.PointLight(0xe0231c, 2.5, 25);
    vermilionLight.position.set(0, 3, -8);
    scene.add(vermilionLight);

    const hallL = new THREE.PointLight(0xff8a26, 2.5, 16, 2);
    hallL.position.set(0, PODIUM + 1.2, TEMPLE_Z + 8.6);
    scene.add(hallL);

    // --- Camera Waypoints Rig ---
    const CAM = [
      { p: [0.0, 4.05, 13.6], t: [0.0, 6.6, -18.0], fov: 36 },
      { p: [-5.6, 2.35, 11.6], t: [1.2, 5.6, -14.0], fov: 48 },
      { p: [1.2, 3.6, 2.2], t: [-0.6, 7.5, -22.0], fov: 40 },
      { p: [5.2, 2.1, -3.4], t: [-2.6, 7.0, -20.0], fov: 46 },
      { p: [0.0, 7.6, -16.0], t: [0.0, 13.0, -40.0], fov: 42 },
      { p: [0.0, 10.5, -20.0], t: [0.0, 3.0, -34.0], fov: 46 },
    ];

    const curveP = new THREE.CatmullRomCurve3(
      CAM.map((c) => new THREE.Vector3(c.p[0], c.p[1], c.p[2])),
      false,
      'catmullrom',
      0.42
    );
    const curveT = new THREE.CatmullRomCurve3(
      CAM.map((c) => new THREE.Vector3(c.t[0], c.t[1], c.t[2])),
      false,
      'catmullrom',
      0.42
    );

    const RIG = { prog: 0, smooth: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
    let anchors = [];
    let maxScroll = 1;

    const measureSections = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - vpH());
      const secIds = ['hero', 'about', 'projects', 'techstack', 'skills', 'education', 'contact'];
      const els = secIds.map((id) => document.getElementById(id)).filter(Boolean);

      if (els.length > 0) {
        anchors = els.map((el, i) => {
          if (i === 0) return 0;
          if (i === els.length - 1) return maxScroll;
          return clamp(el.offsetTop + el.offsetHeight * 0.5 - vpH() * 0.5, 0, maxScroll);
        });
        for (let i = 1; i < anchors.length; i++) {
          anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
        }
      }
    };

    const progressFor = (y) => {
      if (!anchors.length || y <= anchors[0]) return 0;
      const N = anchors.length - 1;
      for (let i = 0; i < N; i++) {
        if (y <= anchors[i + 1]) {
          return i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
        }
      }
      return N;
    };

    measureSections();

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      measureSections();
      placeMoon();
      camera.aspect = vpW() / vpH();
      camera.updateProjectionMatrix();
      renderer.setSize(vpW(), vpH(), true);
    };
    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    let animId;

    const _p = new THREE.Vector3();
    const _t = new THREE.Vector3();

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.getElapsedTime();
      emb.material.uniforms.uT.value = elapsed;

      updateLeaves(dt, elapsed);

      // Animate ground haze planes
      hazePlanes.forEach((h) => {
        h.mesh.position.x = h.x0 + Math.sin(elapsed * h.sp + h.ph) * 3.5;
      });

      RIG.tmx += (mouseX - RIG.tmx) * 0.05;
      RIG.tmy += (mouseY - RIG.tmy) * 0.05;

      const scrollY = window.scrollY || 0;
      const numCAM = CAM.length - 1;
      const rawProg = progressFor(scrollY);
      RIG.prog = (rawProg / Math.max(1, anchors.length - 1)) * numCAM;

      RIG.smooth = damp(RIG.smooth, RIG.prog, 4.5, dt);

      const u = clamp(RIG.smooth / numCAM, 0, 1);
      curveP.getPoint(u, _p);
      curveT.getPoint(u, _t);

      const i = clamp(Math.floor(RIG.smooth), 0, numCAM - 1);
      const f = clamp(RIG.smooth - i, 0, 1);
      let fov = lerp(CAM[i].fov, CAM[i + 1].fov, f);

      _p.x += RIG.tmx * 0.62;
      _p.y += RIG.tmy * 0.34;
      _t.x -= RIG.tmx * 0.2;
      _t.y -= RIG.tmy * 0.12;

      camera.position.copy(_p);
      camera.lookAt(_t);

      if (Math.abs(camera.fov - fov) > 1e-4) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas id="gl-canvas" ref={canvasRef} />;
}
