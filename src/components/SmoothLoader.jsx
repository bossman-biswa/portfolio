import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SmoothLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth load

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const calculated = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(calculated);

      if (calculated < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 200);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="smooth-loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Logo & Counter */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 bg-gradient-to-br from-[#ff8a00] to-[#ea580c] rotate-45"
                />
              </div>
              <span className="text-white font-bold text-2xl tracking-tighter">
                Biswakalyan
              </span>
            </motion.div>

            {/* Subtitle */}
            <p className="text-xs uppercase tracking-[0.25em] text-white/50 font-medium">
              Initializing Intelligence Layer
            </p>

            {/* Progress Counter */}
            <div className="text-4xl font-light text-white tracking-tight font-mono">
              {progress}%
            </div>
          </div>

          {/* Bottom Loading Bar Container */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ea580c] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmoothLoader;
