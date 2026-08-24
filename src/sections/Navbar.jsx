import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isStuck, setIsStuck] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 40);

      const sections = ['hero', 'about', 'projects', 'techstack', 'skills', 'education', 'contact'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240 && rect.bottom >= 240) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: '01 ABOUT', alt: '概要' },
    { id: 'projects', label: '02 PROJECTS', alt: '作品' },
    { id: 'techstack', label: '03 TECH STACK', alt: '技術基盤' },
    { id: 'skills', label: '04 SKILLS', alt: '技術' },
    { id: 'education', label: '05 EDUCATION', alt: '学歴' },
    { id: 'contact', label: '06 CONTACT', alt: '連絡' },
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);
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
    <nav className={`kage-nav ${isStuck ? 'stuck' : ''}`}>
      {/* Brandmark */}
      <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} className="kage-brand">
        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="34" height="34" fill="#05070a" />
          <circle cx="17" cy="18" r="8.5" fill="#e0231c" />
          <rect x="4" y="9" width="26" height="2.8" fill="#dfe7e0" />
          <rect x="7" y="14" width="20" height="2.2" fill="#dfe7e0" />
        </svg>
        <div className="kage-brand-tx">
          <b>BISWAKALYAN</b>
          <i className="jp-label">フルスタック・エンジニア</i>
        </div>
      </a>

      {/* Desktop Links with Roll Reveal Hover Effect */}
      <div className="kage-nav-links">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item.id);
            }}
            className={`kage-nav-link ${activeSection === item.id ? 'on' : ''}`}
          >
            <span>{item.label}</span>
            <span className="alt jp-label">{item.alt}</span>
          </a>
        ))}
      </div>

      {/* Mobile Burger */}
      <div
        className={`kage-burger md:hidden ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <i />
        <i />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[84px] bg-[#05070a]/96 backdrop-blur-2xl border-b border-[var(--line-soft)] p-6 flex flex-col gap-4 md:hidden z-50"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
                className="text-sm font-medium tracking-widest text-[var(--bone)] py-2 border-b border-[var(--line-soft)] flex justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs text-[var(--muted)] jp-label">{item.alt}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
