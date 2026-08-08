import React, { memo } from 'react';
import { motion } from 'motion/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/biswa' },
    { name: 'GitHub', url: 'https://github.com/biswa' },
    { name: 'Email', url: 'mailto:biswa@example.com' },
  ];

  return (
    <footer className="bg-[#0a0908] text-white border-t border-[color:var(--color-gold)]/20 relative z-10">
      <div className="mx-auto max-w-7xl c-space py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Main Footer Row */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
            {/* Brand & Summary */}
            <div className="space-y-3 max-w-sm">
              <a href="/" className="flex items-center gap-2.5 group">
                <span className="w-2 h-2 rounded-full bg-[color:var(--color-gold)] group-hover:scale-125 transition-transform" />
                <span className="font-montserrat text-lg font-bold tracking-[0.12em] text-white group-hover:text-[color:var(--color-gold-light)] transition-colors">
                  BISWAKALYAN
                </span>
              </a>
              <p className="font-oxygen text-sm text-white/70 font-light leading-relaxed">
                Full-Stack & Mobile Developer specializing in high-performance web applications, 3D WebGL simulations, and modern software engineering.
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex flex-wrap gap-12 sm:gap-20">
              {/* Quick Navigation */}
              <div>
                <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-light)] mb-4">
                  Navigation
                </p>
                <ul className="space-y-2.5">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="font-oxygen text-xs text-white/70 hover:text-[color:var(--color-gold-light)] transition-colors duration-200 font-light"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-light)] mb-4">
                  Connect
                </p>
                <ul className="space-y-2.5">
                  {socialLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-oxygen text-xs text-white/70 hover:text-[color:var(--color-gold-light)] transition-colors duration-200 font-light"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status */}
              <div>
                <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-light)] mb-4">
                  Availability
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="font-oxygen text-xs text-emerald-400 font-medium">Open for Internships 2026</span>
                </div>
                <p className="font-oxygen text-xs text-white/50 mt-2 font-light">ITER Bhubaneswar, Odisha</p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Credit Strip */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-oxygen text-white/60 font-light">
            <p>© 2023 — {currentYear} Biswakalyan. All rights reserved.</p>
            <p className="text-white/50">Designed & Built by <span className="text-[color:var(--color-gold-light)] font-medium">Biswakalyan</span></p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default memo(Footer);
