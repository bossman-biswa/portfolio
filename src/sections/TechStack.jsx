import React from 'react';
import { motion } from 'motion/react';

export default function TechStack() {
  const stackCategories = [
    {
      num: '01',
      title: 'Languages & Core Runtimes',
      jp: 'プログラミング言語',
      items: [
        { name: 'Java', level: 'Core & OOP' },
        { name: 'JavaScript (ES6+)', level: 'Advanced' },
        { name: 'TypeScript', level: 'Typed Web' },
        { name: 'HTML5 / CSS3', level: 'Modern Web' },
        { name: 'SQL', level: 'Queries & Schemas' },
      ],
    },
    {
      num: '02',
      title: 'Frontend & 3D WebGL',
      jp: 'フロントエンド & 3D',
      items: [
        { name: 'React', level: 'Component Architecture' },
        { name: 'React Native', level: 'Cross-Platform Mobile' },
        { name: 'Next.js', level: 'SSR & Full-Stack' },
        { name: 'Three.js / WebGL', level: '3D Graphics & Shaders' },
        { name: 'Tailwind CSS', level: 'Utility Styling' },
        { name: 'Framer Motion', level: 'Physics & Animations' },
      ],
    },
    {
      num: '03',
      title: 'Backend & System Architecture',
      jp: 'バックエンド & API',
      items: [
        { name: 'Node.js', level: 'Server Runtime' },
        { name: 'Express.js', level: 'REST APIs & Middleware' },
        { name: 'Token Bucket Alg.', level: 'Rate Limiting' },
        { name: 'RESTful Architecture', level: 'API Design' },
      ],
    },
    {
      num: '04',
      title: 'Databases & Persistence',
      jp: 'データベース',
      items: [
        { name: 'MongoDB', level: 'NoSQL & Document' },
        { name: 'MySQL', level: 'Relational Database' },
        { name: 'GraphQL', level: 'Query Language' },
      ],
    },
    {
      num: '05',
      title: 'DevOps & Development Tools',
      jp: '開発ツール & DevOps',
      items: [
        { name: 'Docker', level: 'Containerization' },
        { name: 'Git & GitHub', level: 'Version Control' },
        { name: 'VS Code', level: 'Primary IDE' },
        { name: 'Postman', level: 'API Testing' },
        { name: 'Vite', level: 'Modern Bundler' },
        { name: 'AI Coding Tools', level: 'Assisted Workflow' },
      ],
    },
  ];

  return (
    <section id="techstack" className="kage-sec">
      {/* Section Header */}
      <div className="kage-sec-head">
        <span className="k">
          <b>TECH STACK</b> &bull; SYSTEM TOOLS
        </span>
        <div className="kage-rule" />
      </div>

      <div className="cur-head">
        <h2 className="display-title h-sec">LANGUAGES & INFRASTRUCTURE</h2>
        <p className="body-desc">
          Categorized technical stack spanning core programming languages, modern frontend frameworks, backend runtimes, databases, and DevOps tools.
        </p>
      </div>

      {/* Grid of 5 Tech Stack Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stackCategories.map((cat, i) => (
          <motion.div
            key={cat.num}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="kage-card group"
          >
            <div className="kage-card-meta">
              <span>CATEGORY // {cat.num}</span>
              <span className="jp-label">{cat.jp}</span>
            </div>

            <h3 className="kage-card-title text-xl mb-4 group-hover:text-[var(--vermilion)] transition-colors">
              {cat.title}
            </h3>

            <div className="flex flex-col gap-2.5 mt-4">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded bg-[rgba(223,231,224,0.03)] border border-[var(--line-soft)] group-hover:border-[rgba(223,231,224,0.15)] transition-all"
                >
                  <span className="text-xs font-medium text-[var(--bone)]">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--muted)]">
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
