import React from 'react';
import { motion } from 'motion/react';

export default function Projects() {
  const projects = [
    {
      id: '01',
      title: 'Token Bucket Rate Limiter',
      subtitle: 'System Architecture & Algorithm Design',
      desc: 'Implemented a high-performance token bucket algorithm to control API request rates, ensuring fair resource distribution, preventing system abuse, and improving reliability under heavy traffic bursts.',
      tags: ['Node.js', 'Express.js', 'System Design', 'API Rate Limiting'],
    },
    {
      id: '02',
      title: 'Task Management Web App',
      subtitle: 'Full-Stack Web Application',
      desc: 'Developed a full-stack task creation and management tool featuring real-time status updates, user authentication workflows, structured data modeling, and seamless UI state persistence.',
      tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    },
    {
      id: '03',
      title: 'Personal Portfolio Website',
      subtitle: 'Interactive 3D WebGL & Editorial Experience',
      desc: 'Built an ultra-high performance portfolio with Three.js WebGL particle swarms, Framer Motion transitions, custom cursor physics, and atmospheric editorial styling to showcase engineering work.',
      tags: ['React', 'Vite', 'Three.js', 'Framer Motion', 'WebGL Shader'],
    },
  ];

  return (
    <section id="projects" className="kage-sec">
      {/* Section Header */}
      <div className="kage-sec-head">
        <span className="k">
          <b>CHAPTER II</b> &bull; PATHWAYS
        </span>
        <div className="kage-rule" />
      </div>

      <div className="mb-12">
        <h2 className="display-title h-sec">FEATURED PROJECTS</h2>
      </div>

      {/* 3 Interactive Cards Grid */}
      <div className="kage-cards">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="kage-card"
          >
            <div className="kage-card-meta">
              <span>PROJECT // {proj.id}</span>
              <span className="jp-label">作品</span>
            </div>

            <h3 className="kage-card-title">{proj.title}</h3>
            <p className="text-xs uppercase tracking-widest text-[#aab4ad] mb-4">
              {proj.subtitle}
            </p>

            <p className="kage-card-desc">{proj.desc}</p>

            <div className="kage-card-tags">
              {proj.tags.map((tag) => (
                <span key={tag} className="kage-tag">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
