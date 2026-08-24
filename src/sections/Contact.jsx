import React from 'react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <section id="contact" className="fin-sec">
      <div className="eyebrow">
        <span>CHAPTER IV &bull; ETERNITY</span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="display-title"
      >
        WHERE STILLNESS
        <br />
        MEETS ACTION.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        Currently seeking software engineering and full-stack development internship opportunities. Open for technical collaborations, application development, and engineering inquiries.
      </motion.p>

      {/* Interactive Pill CTA */}
      <motion.a
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        href="mailto:biswa.palai2004@gmail.com"
        className="kage-cta"
      >
        <i />
        <span>SEND DIRECT EMAIL</span>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 12L12 4M12 4H5M12 4V11"
            stroke="#dfe7e0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>

      {/* Direct Contact Metadata */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-2xl w-full border-t border-[var(--line-soft)] pt-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] block mb-1">
            EMAIL
          </span>
          <a href="mailto:biswa.palai2004@gmail.com" className="text-xs font-mono text-[var(--bone)] hover:text-[var(--vermilion)] transition-colors">
            biswa.palai2004@gmail.com
          </a>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] block mb-1">
            PHONE
          </span>
          <a href="tel:9861508628" className="text-xs font-mono text-[var(--bone)] hover:text-[var(--vermilion)] transition-colors">
            +91 9861508628
          </a>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] block mb-1">
            LOCATION
          </span>
          <span className="text-xs text-[var(--bone)] font-mono">
            ITER, Bhubaneswar
          </span>
        </div>
      </div>
    </section>
  );
}
