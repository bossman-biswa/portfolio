import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KagePreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let start = performance.now();
    const duration = 1400; // 1.4s

    const update = (time) => {
      const elapsed = time - start;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setIsLoaded(true);
          if (onComplete) onComplete();
        }, 200);
      }
    };

    requestAnimationFrame(update);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          id="pre"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] } }}
        >
          <div className="pre-in">
            {/* Vermilion Moon Mark */}
            <div className="pre-mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" fill="#05070a" />
                <circle cx="16" cy="17" r="8" fill="#e0231c" />
                <rect x="4" y="8" width="24" height="2.6" fill="#dfe7e0" />
                <rect x="7" y="13" width="18" height="2" fill="#dfe7e0" />
              </svg>
            </div>

            <div className="pre-jp jp-label">ビスワカリヤン・ポートフォリオ</div>

            <div className="pre-bar">
              <div
                style={{
                  position: 'absolute',
                  inset: '0 0 0 0',
                  background: '#dfe7e0',
                  transform: `scaleX(${progress / 100})`,
                  transformOrigin: 'left',
                  transition: 'transform 0.1s linear',
                }}
              />
            </div>

            <div className="pre-meta">
              <span>Initializing WebGL World</span>
              <b>{progress.toString().padStart(2, '0')}%</b>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
