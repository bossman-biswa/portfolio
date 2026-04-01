import React, { useState, useEffect } from 'react';
import { FlipWords } from './FlipWords';
import { motion } from 'motion/react';

const HeroText = () => {
  const [isMobile, setIsMobile] = useState(false);
  const words = ["Secure", "Modern", "Scalable"];

  // Detect mobile/desktop on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile view styling
  const mobileClasses = {
    container: "z-10 my-16 px-4 text-center rounded-3xl bg-clip-text",
    heading: "text-xl sm:text-2xl font-medium mb-4 leading-tight",
    subtitle: "text-2xl sm:text-3xl font-semibold text-neutral-200 mb-3 leading-snug",
    flipWords: "text-3xl sm:text-4xl font-black text-white mb-4",
    body: "text-base sm:text-lg font-medium text-neutral-400 mt-2",
  };

  // Desktop view styling
  const desktopClasses = {
    container: "z-10 mt-40 text-left rounded-3xl bg-clip-text",
    heading: "text-4xl font-medium mb-6",
    subtitle: "text-5xl font-semibold text-neutral-300 mb-4 leading-tight",
    flipWords: "text-8xl font-black text-white mb-6",
    body: "text-4xl font-medium text-neutral-400 mt-4",
  };

  const classes = isMobile ? mobileClasses : desktopClasses;

  return (
    <div className={classes.container}>
      <motion.h1
        className={classes.heading}
        initial={{ opacity: 0, x: isMobile ? 0 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Hi, I'm Biswa
      </motion.h1>

      <div className="flex flex-col items-center md:items-start">
        <motion.p
          className={classes.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I'm a passionate developer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <FlipWords
            words={words}
            className={classes.flipWords}
          />
        </motion.div>

        <motion.p
          className={classes.body}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Web development solutions
        </motion.p>
      </div>
    </div>
  );
};

export default HeroText;
