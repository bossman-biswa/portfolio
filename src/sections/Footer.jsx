import React from 'react';

export default function Footer() {
  return (
    <footer className="kage-foot">
      <div className="kage-foot-grid">
        {/* Brand Info */}
        <div className="kage-foot-brand">
          <div className="kage-brand">
            <svg viewBox="0 0 34 34" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" fill="#05070a" />
              <circle cx="17" cy="18" r="8.5" fill="#e0231c" />
              <rect x="4" y="9" width="26" height="2.8" fill="#dfe7e0" />
              <rect x="7" y="14" width="20" height="2.2" fill="#dfe7e0" />
            </svg>
            <div className="kage-brand-tx">
              <b>BISWAKALYAN PALAI</b>
              <i className="jp-label">ポートフォリオ 2026</i>
            </div>
          </div>
          <p>
            Junior Software & Full-Stack Developer at ITER Bhubaneswar (B.Tech CS & IT 2023 — 2027). Dedicated to engineering high-performance WebGL & full-stack software.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4>NAVIGATION</h4>
          <ul>
            <li><a href="#about">01 About</a></li>
            <li><a href="#projects">02 Projects</a></li>
            <li><a href="#skills">03 Skills</a></li>
            <li><a href="#education">04 Academics</a></li>
            <li><a href="#contact">05 Contact</a></li>
          </ul>
        </div>

        {/* Core Stack */}
        <div>
          <h4>TECH STACK</h4>
          <ul>
            <li><a href="#skills">Java & JavaScript</a></li>
            <li><a href="#skills">React & React Native</a></li>
            <li><a href="#skills">Node.js & Express</a></li>
            <li><a href="#skills">Three.js & WebGL</a></li>
            <li><a href="#skills">MongoDB & MySQL</a></li>
          </ul>
        </div>

        {/* Credentials */}
        <div>
          <h4>CREDENTIALS</h4>
          <ul>
            <li><a href="#education">B.Tech CS & IT (ITER)</a></li>
            <li><a href="#skills">Full-Stack (Coursera)</a></li>
            <li><a href="#skills">Frontend (Udemy)</a></li>
            <li><a href="#skills">UI/UX (IIT Bhubaneswar)</a></li>
          </ul>
        </div>
      </div>

      {/* Base Bar */}
      <div className="kage-foot-base">
        <div>© 2023 — 2027 BISWAKALYAN PALAI. ALL RIGHTS RESERVED.</div>
        <div>BHUBANESWAR, ODISHA, INDIA</div>
      </div>
    </footer>
  );
}
