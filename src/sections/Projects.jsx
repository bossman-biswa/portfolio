import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import TiltCard from '../components/TiltCard';

const Projects = () => {
  const projectList = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration and real-time inventory management.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Real-time collaborative task management tool featuring drag-and-drop boards and analytics.',
      tags: ['React', 'Firebase', 'Tailwind'],
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Modern portfolio built with 3D WebGL particle swarms, Framer Motion, and editorial styling.',
      tags: ['React', 'Vite', 'Three.js', 'Tailwind'],
    },
    {
      id: 4,
      title: 'Chat Application',
      description: 'Real-time messaging platform with WebSocket integration, room channels, and rich media support.',
      tags: ['React', 'Socket.io', 'Express', 'MongoDB'],
    },
    {
      id: 5,
      title: 'Token Bucket Rate Limiter',
      description: 'API rate limiting service using a token bucket algorithm for stable, burst-friendly throttling.',
      tags: ['Node.js', 'Express', 'Rate Limiting', 'API'],
    },
  ];

  // Mouse position tracking for side-by-side track shift effect
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for side-by-side shift
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Map mouse position relative to container center (-1 to 1) to horizontal offset (-15px to +15px)
  const trackX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const trackY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="minimal-theme c-space section-spacing overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <p className="font-raleway section-label uppercase tracking-[0.2em]">Work</p>
            <h2 className="font-raleway text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
            <p className="subtext max-w-xl">
              A selection of projects showcasing full-stack development, modern web technologies, and interactive visual design.
            </p>
          </div>
        </div>

        {/* Side-by-side interactive grid with mouse shift effect */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="py-4"
        >
          <motion.div
            style={{ x: trackX, y: trackY }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {projectList.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <TiltCard className="h-full rounded-sm p-8 md:p-9 flex flex-col justify-between group transition-colors duration-300">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="font-roboto-slab text-2xl font-semibold opacity-40 group-hover:opacity-100 group-hover:text-[color:var(--color-hero-accent)] transition-colors duration-300">
                        {String(project.id).padStart(2, '0')}
                      </span>
                      <div className="w-8 h-[1px] bg-border group-hover:bg-[color:var(--color-hero-accent)] transition-colors duration-300" />
                    </div>

                    <h3 className="font-raleway text-xl font-bold mb-3 text-foreground group-hover:text-[color:var(--color-hero-accent)] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="subtext text-sm leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
                    {project.tags.map((tag) => (
                      <span key={project.id + '-' + tag} className="font-roboto-slab tag-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Projects);
