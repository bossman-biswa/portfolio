import React from 'react';
import { motion } from 'motion/react';

export default function Skills() {
  const categories = [
    {
      num: '01',
      title: 'Programming & Core Development',
      jp: 'プログラミング',
      desc: 'Java, JavaScript, React, React Native, Node.js, Next.js, Express.js, Three.js, Docker',
      time: 'CORE STACK',
    },
    {
      num: '02',
      title: 'Database Technologies',
      jp: 'データベース',
      desc: 'MongoDB, MySQL, GraphQL & Distributed Data Schemas',
      time: 'PERSISTENCE',
    },
    {
      num: '03',
      title: 'Development Specializations',
      jp: '開発専門',
      desc: 'Full-Stack Web Development, Mobile App Development, UI/UX Design, System Architecture',
      time: 'FOCUS',
    },
    {
      num: '04',
      title: 'Tools & Environments',
      jp: '開発ツール',
      desc: 'Git, VS Code, Docker, AI-Assisted Coding Tools, Postman, Vite',
      time: 'WORKFLOW',
    },
    {
      num: '05',
      title: 'Certifications & Workshops',
      jp: '修了証',
      desc: 'Full-Stack Web Development Basics (Coursera), JavaScript & Frontend Bootcamp (Udemy), UI/UX Design Workshop (Wissenaire - IIT Bhubaneswar)',
      time: 'VERIFIED',
    },
  ];

  return (
    <section id="skills" className="kage-sec">
      {/* Section Header */}
      <div className="kage-sec-head">
        <span className="k">
          <b>CHAPTER III</b> &bull; CURRICULUM
        </span>
        <div className="kage-rule" />
      </div>

      <div className="cur-head">
        <h2 className="display-title h-sec">TECHNICAL SKILLS & CERTIFICATIONS</h2>
        <p className="body-desc">
          A structured breakdown of core engineering capabilities, databases, frameworks, and verified certifications.
        </p>
      </div>

      {/* Curriculum Lesson Rows */}
      <div className="cur-list">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="les-row"
          >
            <span className="k">{cat.num}</span>
            <h3>
              {cat.title}
              <em>{cat.jp}</em>
            </h3>
            <p>{cat.desc}</p>
            <span className="t">{cat.time}</span>
            <div className="bar" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
