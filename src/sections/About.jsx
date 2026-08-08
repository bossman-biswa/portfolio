import React from 'react';
import { motion } from 'motion/react';

const About = () => {
  const items = [
    {
      id: 1,
      title: 'Current Status',
      description: '3rd Year B.Tech CS Student seeking Internship Opportunities',
    },
    {
      id: 2,
      title: 'Primary Domain',
      description: 'Full-Stack Web & Mobile Application Development',
    },
    {
      id: 3,
      title: 'Core Passion',
      description: 'Building scalable applications & continuous real-world learning',
    },
    {
      id: 4,
      title: 'Engineering Focus',
      description: 'Clean code architecture, robust APIs & thoughtful UI/UX design',
    },
  ];

  const headingWords = "Junior Software & Full-Stack Developer".split(" ");

  return (
    <section className="minimal-theme section-accent-top c-space section-spacing">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Section Label with Expanding Accent Line */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[2px] bg-[color:var(--color-hero-accent)] block"
          />
          <p className="font-oxygen section-label mb-0 uppercase tracking-[0.2em]">Professional Summary</p>
        </motion.div>

        {/* Word-by-Word Stagger Reveal Heading with Crimson Pro font */}
        <h2 className="font-crimson text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 overflow-hidden flex flex-wrap gap-x-3 gap-y-1">
          {headingWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 30, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15 + idx * 0.08,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              viewport={{ once: true }}
              className="inline-block hover:text-[color:var(--color-hero-accent)] transition-colors duration-300 cursor-default"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Summary Paragraph with Oxygen font */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="font-oxygen subtext max-w-3xl mb-16 text-base md:text-lg leading-relaxed border-l-2 border-[color:var(--color-hero-accent)]/50 pl-6 py-1 font-light"
        >
          B.Tech Computer Science student seeking internship opportunities. Skilled in full-stack and mobile app development with hands-on project experience in modern technologies. Passionate about building scalable applications and learning in real-world environments.
        </motion.p>

        {/* Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-surface p-8 md:p-10 group transition-all duration-300 relative overflow-hidden cursor-pointer hover:bg-[#ebe3d9] hover:shadow-xl hover:shadow-black/5 z-10"
            >
              {/* Left Coral Accent Bar on Hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[color:var(--color-hero-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-6">
                <span className="font-crimson text-3xl md:text-4xl text-muted/40 group-hover:text-[color:var(--color-hero-accent)] group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 group-hover:translate-x-1 shrink-0 font-bold">
                  0{item.id}
                </span>

                <div className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                  <h3 className="font-crimson text-xl md:text-2xl font-semibold mb-2 text-foreground group-hover:text-[color:var(--color-hero-accent)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-oxygen text-sm leading-relaxed text-muted group-hover:text-foreground/80 transition-colors duration-300 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(About);
