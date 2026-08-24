import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero" className="kage-hero">
      {/* Side Kanji / Vertical Typography */}
      <div className="kage-hero-side">
        <div className="v jp-label">フルスタック開発者</div>
      </div>

      {/* Hero Top Content */}
      <div className="kage-hero-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow"
        >
          <span className="dot" />
          <span>00 // PERSPECTIVE &bull; ITER BHUBANESWAR 2023 — 2027</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="display-title h-hero"
        >
          WHERE CODE
          <br />
          REVEALS THE UNSEEN.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="body-lg kage-hero-sub"
        >
          Biswakalyan Palai — Junior Software & Full-Stack Developer specializing in scalable distributed architectures, interactive WebGL experiences, and clean full-stack applications.
        </motion.p>
      </div>

      <div className="kage-hero-spacer" />

      {/* Floating Peek Window with Cinematic Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="kage-peek"
        onClick={() => scrollTo('projects')}
      >
        <div className="kage-peek-fr relative overflow-hidden group border border-[#e0231c]/40 rounded-md shadow-2xl">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url('/assets/kage_cinematic_bg.png')`,
            }}
          />

          {/* Dark Scrim Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial from-[#e0231c]/20 via-transparent to-[#05070a]/90" />

          {/* Glowing Indicator Mote */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#05070a]/80 border border-[#e0231c]/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e0231c] animate-ping" />
            <span className="text-[8px] font-mono text-[#dfe7e0] uppercase tracking-widest">LIVE PREVIEW</span>
          </div>

          {/* Foreground Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center p-5 text-center bg-black/40 backdrop-blur-[2px] transition-colors duration-500 group-hover:bg-black/20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0231c]/30 border border-[#e0231c]/50 mb-2 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e0231c] animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#dfe7e0] font-semibold">
                  FEATURED WORK
                </span>
              </div>
              <h3 className="text-sm font-medium tracking-wide text-white group-hover:text-[#ff5a3c] transition-colors duration-300 drop-shadow-md">
                Rate Limiter & WebGL Architecture
              </h3>
              <p className="text-[11px] text-[#c0c9c2] mt-1 font-light tracking-wider drop-shadow">
                Token Bucket Engine & Interactive 3D World
              </p>
            </div>
          </div>
        </div>

        <div className="kage-peek-cap mt-2 flex justify-between items-center text-xs">
          <b className="jp-label text-[10px] text-[#e0231c] font-medium tracking-widest">作品プレビュー</b>
          <i className="not-italic text-[10px] tracking-widest text-[#aab4ad]">CHAPTER II PREVIEW &rarr;</i>
        </div>
      </motion.div>

      {/* Hero Foot (Scroll Cue + Chapter Index Chips) */}
      <div className="kage-hero-foot">
        <div className="kage-hero-cue">
          <span>SCROLL TO DISCOVER</span>
          <div className="track">
            <i />
          </div>
        </div>

        <div className="kage-chapters">
          <div className="kage-chip" onClick={() => scrollTo('about')}>
            <span className="num">01</span>
            <span className="tx-title">ABOUT</span>
          </div>
          <div className="kage-chip" onClick={() => scrollTo('projects')}>
            <span className="num">02</span>
            <span className="tx-title">PROJECTS</span>
          </div>
          <div className="kage-chip" onClick={() => scrollTo('skills')}>
            <span className="num">03</span>
            <span className="tx-title">SKILLS</span>
          </div>
          <div className="kage-chip" onClick={() => scrollTo('contact')}>
            <span className="num">04</span>
            <span className="tx-title">CONTACT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
