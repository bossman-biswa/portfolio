import React from 'react';
import { motion } from 'motion/react';

export default function Education() {
  const educationItems = [
    {
      num: '01',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Information Technology',
      institution: 'Institute of Technical Education and Research (ITER), Bhubaneswar',
      timeline: '2023 — 2027 (Current: 3rd Year)',
      jp: '大学・学士',
      highlight: 'Specializing in Full-Stack Web Development, Data Structures, Algorithms, Mobile App Development, and System Architecture.',
    },
    {
      num: '02',
      degree: 'Senior Secondary Education (Class 12 - CBSE)',
      field: 'Science Stream (Physics, Chemistry, Mathematics & CS)',
      institution: 'Jawahar Navodaya Vidyalaya',
      timeline: 'Completed',
      jp: '高校・理数',
      highlight: 'Strong foundation in analytical thinking, mathematics, and computer fundamentals.',
    },
    {
      num: '03',
      degree: 'Secondary Education (Class 10 - CBSE)',
      field: 'General Academics & STEM Focus',
      institution: 'Jawahar Navodaya Vidyalaya',
      timeline: 'Completed',
      jp: '中学・基礎',
      highlight: 'Excellence in mathematics and core sciences with active participation in STEM initiatives.',
    },
  ];

  return (
    <section id="education" className="kage-sec">
      {/* Section Header */}
      <div className="kage-sec-head">
        <span className="k">
          <b>BACKGROUND</b> &bull; ACADEMICS
        </span>
        <div className="kage-rule" />
      </div>

      <div className="cur-head">
        <h2 className="display-title h-sec">ACADEMIC FOUNDATION</h2>
        <p className="body-desc">
          Formal engineering education and academic credentials in Computer Science & IT.
        </p>
      </div>

      <div className="cur-list">
        {educationItems.map((edu, idx) => (
          <motion.div
            key={edu.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            className="les-row"
          >
            <span className="k">{edu.num}</span>
            <div>
              <h3>
                {edu.degree}
                <em>{edu.jp}</em>
              </h3>
              <p className="text-xs uppercase tracking-wider text-[var(--vermilion)] mt-1 font-mono">
                {edu.institution}
              </p>
            </div>
            <p>{edu.highlight}</p>
            <span className="t">{edu.timeline}</span>
            <div className="bar" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
