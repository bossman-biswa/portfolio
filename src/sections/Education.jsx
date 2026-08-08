import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const Education = () => {
  const containerRef = useRef(null);

  // Track scroll progress specifically through the education timeline - starting earlier
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 75%"]
  });

  // Physics spring for silky smooth vertical timeline fill
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 25,
    restDelta: 0.001
  });

  const educationList = [
    {
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Information Technology',
      institution: 'Institute of Technical Education and Research (ITER), Bhubaneswar',
      year: '2023 — 2027 (Current: 3rd Year)',
      highlight: 'Specializing in Full-Stack Web Development, Data Structures, Mobile App Development, and Software Engineering.',
    },
    {
      degree: 'Senior Secondary Education (Class 12 - CBSE)',
      field: 'Science Stream (Physics, Chemistry, Mathematics & CS)',
      institution: 'Jawahar Navodaya Vidyalaya',
      year: 'Completed',
      highlight: 'Strong foundation in analytical thinking, mathematics, and computer fundamentals.',
    },
    {
      degree: 'Secondary Education (Class 10 - CBSE)',
      field: 'General Academics',
      institution: 'Jawahar Navodaya Vidyalaya',
      year: 'Completed',
      highlight: 'Excellence in mathematics and core sciences with active participation in STEM initiatives.',
    },
  ];

  return (
    <section id="education" className="minimal-theme section-accent-top c-space section-spacing relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.05 }}
      >
        {/* Section Label with Expanding Accent Line */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.05 }}
          className="flex items-center gap-3 mb-4"
        >
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.05 }}
            className="h-[2px] bg-[color:var(--color-hero-accent)] block"
          />
          <p className="section-label mb-0">Background</p>
        </motion.div>

        <h2 className="font-nanum-myeongjo text-3xl md:text-4xl font-bold mb-6 text-foreground">Education & Credentials</h2>
        <p className="font-nanum-gothic subtext max-w-2xl mb-16">
          Academic foundation and formal training in Computer Science & Engineering.
        </p>

        {/* Timeline Container with Scroll-Driven Progress Line */}
        <div ref={containerRef} className="relative pl-6 md:pl-10 space-y-16 ml-2 md:ml-4">

          {/* Background Timeline Track Line */}
          <div className="absolute -left-[1px] md:-left-[1px] top-4 bottom-4 w-[2px] bg-border/60">
            {/* Scroll-Driven Smooth Filling Line */}
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="w-full h-full bg-[color:var(--color-hero-accent)] shadow-[0_0_10px_rgba(196,85,58,0.4)]"
            />
          </div>

          {educationList.map((edu, idx) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -160, y: -45, rotate: -3, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 14,
                mass: 1.1,
                delay: 0.02,
              }}
              viewport={{ once: true, amount: 0.05, margin: "100px 0px -20px 0px" }}
              className="relative group will-change-transform"
            >
              {/* Timeline Marker Node Circle */}
              <motion.div
                initial={{ scale: 0, x: -40, opacity: 0 }}
                whileInView={{ scale: [0, 1.4, 1], x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.05 }}
                viewport={{ once: true, amount: 0.05, margin: "100px 0px -20px 0px" }}
                className="absolute -left-[31px] md:-left-[47px] top-4 w-4 h-4 rounded-full bg-surface border-2 border-[color:var(--color-hero-accent)] shadow-md group-hover:bg-[color:var(--color-hero-accent)] group-hover:scale-125 transition-all duration-300 z-10"
              />

              {/* Individual Card with Left-to-Right Drop & Hover Lift */}
              <motion.div
                whileHover={{ x: 8, y: -3 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-surface p-8 md:p-10 border border-border group-hover:border-[color:var(--color-hero-accent)] group-hover:shadow-2xl group-hover:shadow-black/5 transition-all duration-300 rounded-sm relative overflow-hidden transform-gpu"
              >
                {/* Top Accent Line on Card Hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[color:var(--color-hero-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <span className="font-nanum-gothic text-xs font-semibold uppercase tracking-widest text-[color:var(--color-hero-accent)]">
                    {edu.year}
                  </span>
                  <span className="font-nanum-myeongjo text-lg font-bold opacity-40 group-hover:opacity-100 group-hover:text-[color:var(--color-hero-accent)] transition-all">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-nanum-myeongjo text-xl md:text-2xl font-bold mb-1 group-hover:text-[color:var(--color-hero-accent)] transition-colors duration-300">
                  {edu.degree}
                </h3>
                <p className="font-nanum-gothic text-sm font-semibold text-foreground mb-3">{edu.field}</p>

                <p className="font-nanum-gothic text-xs uppercase tracking-wider text-muted mb-4">{edu.institution}</p>

                <p className="font-nanum-gothic text-sm leading-relaxed text-muted group-hover:text-foreground/80 transition-colors duration-300">
                  {edu.highlight}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Education);
