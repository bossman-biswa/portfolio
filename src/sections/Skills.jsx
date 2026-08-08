import React from 'react';
import { motion } from 'motion/react';
import TiltCard from '../components/TiltCard';

const Skills = () => {
  const skillCategories = [
    {
      category: 'Programming & Core',
      skills: ['Java', 'JavaScript', 'React', 'React Native', 'Node.js', 'Next.js', 'Express.js', 'Three.js', 'Docker'],
    },
    {
      category: 'Database Technologies',
      skills: ['MongoDB', 'MySQL', 'GraphQL'],
    },
    {
      category: 'Development Focus',
      skills: ['Web Development', 'Mobile App Development', 'UI/UX Design', 'Full-Stack Architecture'],
    },
    {
      category: 'Tools & Environment',
      skills: ['Git', 'VS Code', 'Docker', 'AI-Assisted Coding Tools', 'Vite', 'Postman'],
    },
    {
      category: 'Soft Skills & Leadership',
      skills: ['Teamwork', 'Analytical Thinking', 'Leadership', 'Adaptability', 'Problem Solving'],
    },
  ];

  return (
    <section id="skills" className="minimal-theme section-accent-top c-space section-spacing relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="font-montserrat section-label uppercase tracking-[0.2em]">Capabilities</p>
        <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-6 text-foreground">Technical & Professional Skills</h2>
        <p className="font-oxygen subtext max-w-2xl mb-16">
          A comprehensive overview of technologies, frameworks, and methodologies I leverage to build scalable products.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
            >
              <TiltCard className="h-full p-8 rounded-sm group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-montserrat text-xl font-semibold opacity-50 group-hover:text-[color:var(--color-hero-accent)] group-hover:opacity-100 transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="font-oxygen text-xs uppercase tracking-widest text-muted group-hover:text-foreground transition-colors font-medium">
                      {cat.skills.length} Items
                    </span>
                  </div>

                  <h3 className="font-montserrat text-lg font-bold mb-6 text-foreground group-hover:text-[color:var(--color-hero-accent)] transition-colors">
                    {cat.category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span key={skill} className="font-oxygen tag-accent text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Skills);
