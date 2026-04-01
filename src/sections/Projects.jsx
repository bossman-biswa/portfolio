import { motion } from 'motion/react';
import React from 'react';

const Projects = () => {
  const projectList = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      gradient: 'from-aqua to-mint',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Real-time collaborative task management tool',
      tags: ['React', 'Firebase', 'Tailwind'],
      gradient: 'from-royal to-lavender',
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Modern portfolio with smooth animations',
      tags: ['React', 'Vite', 'Motion', 'Tailwind'],
      gradient: 'from-coral to-fuchsia',
    },
    {
      id: 4,
      title: 'Chat Application',
      description: 'Real-time messaging with WebSocket integration',
      tags: ['React', 'Socket.io', 'Express', 'MongoDB'],
      gradient: 'from-sand to-orange',
    },
  ];

  const gradientStyles = {
    'from-aqua to-mint': 'bg-gradient-to-br from-aqua to-mint',
    'from-royal to-lavender': 'bg-gradient-to-br from-royal to-lavender',
    'from-coral to-fuchsia': 'bg-gradient-to-br from-coral to-fuchsia',
    'from-sand to-orange': 'bg-gradient-to-br from-sand to-orange',
  };

  return (
    <section className="c-space section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}>
        <div className="mb-12">
          <motion.h2 className="text-heading">Featured Projects</motion.h2>
          <p className="subtext mt-4">
            A selection of projects showcasing my expertise in full-stack development and modern web technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projectList.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${gradientStyles[project.gradient]} p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <div className="p-6 bg-black/40 rounded-xl backdrop-blur-sm h-full flex flex-col">
                <h3 className="headtext mb-3">{project.title}</h3>
                <p className="subtext flex-grow mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={project.id + '-' + tag}
                      className="px-3 py-1 text-xs rounded-full bg-white/10 text-neutral-300 hover:bg-white/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
