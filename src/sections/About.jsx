import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="kage-sec">
      {/* Section Header */}
      <div className="kage-sec-head">
        <span className="k">
          <b>CHAPTER I</b> &bull; THE GATE
        </span>
        <div className="kage-rule" />
      </div>

      <div className="gate-grid">
        {/* Left Column: Display Headline */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="display-title h-sec"
          >
            ARCHITECTING
            <br />
            SCALABLE &
            <br />
            INTUITIVE
            <br />
            SYSTEMS.
          </motion.h2>

          <a
            href="mailto:biswa.palai2004@gmail.com"
            className="arrowlink"
          >
            <span>GET IN TOUCH FOR INTERNSHIPS</span>
            <div className="ar">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 12L12 4M12 4H5M12 4V11"
                  stroke="#dfe7e0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </div>

        {/* Right Column: Lead Copy */}
        <div className="gate-copy">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lead"
          >
            B.Tech Computer Science & Information Technology student at the Institute of Technical Education and Research (ITER), Bhubaneswar. Skilled in full-stack web and mobile application development with hands-on project experience in modern engineering stacks.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="body-desc"
          >
            Passionate about building high-performance scalable applications, implementing resilient system algorithms, and mastering real-world software development in fast-paced production environments.
          </motion.p>

          {/* Key Stats Bar */}
          <div className="gate-stats">
            <div>
              <b>3rd Year</b>
              <span>B.Tech CS & IT @ ITER</span>
            </div>
            <div>
              <b>03 Flagship</b>
              <span>Projects Built</span>
            </div>
            <div>
              <b>2023–2027</b>
              <span>Academic Timeline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
