import React from 'react';
import { motion } from 'motion/react';

const About = () => {
  const gridItems = [
    {
      id: 1,
      title: 'Tech Stack',
      description: 'React, Node.js, Tailwind CSS, MongoDB',
      class: 'grid-1 grid-default-color',
    },
    {
      id: 2,
      title: 'Experience',
      description: '3+ years building modern web applications',
      class: 'grid-2 grid-default-color',
    },
    {
      id: 3,
      title: 'Specialized In',
      description: 'Full Stack Development & UI/UX Design',
      class: 'grid-3 grid-special-color',
    },
    {
      id: 4,
      title: 'Passion',
      description: 'Creating scalable solutions',
      class: 'grid-4 grid-default-color',
    },
    {
      id: 5,
      title: 'Vision',
      description: 'Building products that make a difference',
      class: 'grid-5 grid-black-color',
    },
  ];

  return (
    <section className="c-space section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}>
        <div className="mb-12">
          <motion.h2 className="text-heading">About Me</motion.h2>
          <p className="subtext mt-4">
            I'm a passionate developer focused on creating secure, modern, and scalable web solutions. 
            With a strong foundation in full-stack development, I turn ideas into reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          {gridItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item.id * 0.1 }}
              viewport={{ once: true }}
              className={item.class}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="headtext">{item.title}</h3>
                  <p className="subtext">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
