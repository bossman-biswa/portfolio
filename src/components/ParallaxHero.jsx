import React, { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform, motion, useMotionValue, useSpring } from 'motion/react';

const ParallaxHero = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [totalFrames] = useState(128); // Total frames in heroimg folder
  const [stopScrollPosition, setStopScrollPosition] = useState(2000);
  const { scrollY } = useScroll();
  const heroOpacity = useMotionValue(1);
  const aboutSectionRef = useRef(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track when About section comes into view and set stop position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the scroll position when About section reaches viewport
            const aboutElement = entry.target;
            const elementTop = aboutElement.getBoundingClientRect().top + window.scrollY;
            setStopScrollPosition(Math.max(elementTop - window.innerHeight, 0));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Find and observe the About section (wait a bit for DOM to be ready)
    const findAboutSection = () => {
      const aboutElement = document.querySelector('#about');
      if (aboutElement) {
        observer.observe(aboutElement);
        aboutSectionRef.current = aboutElement;
      } else {
        // Retry if not found immediately
        setTimeout(findAboutSection, 100);
      }
    };

    findAboutSection();

    return () => {
      if (aboutSectionRef.current) observer.unobserve(aboutSectionRef.current);
    };
  }, []);

  // Mouse tracking for additional parallax effect (desktop only)
  const mouseY = useMotionValue(0);
  const smoothMouseY = useSpring(mouseY, {
    damping: 50,
    mass: 0.8,
    stiffness: 100,
  });

  // Transform scroll position to frame index (0-127)
  // Stop frame progression at About section
  const frameProgress = useTransform(scrollY, [0, stopScrollPosition], [0, totalFrames - 1]);

  // Mouse-based Y offset for subtle parallax (desktop only)
  const yOffset = useTransform(smoothMouseY, [-window.innerHeight, window.innerHeight], [-20, 20]);

  useEffect(() => {
    // Subscribe to frame progress changes
    const unsubscribe = frameProgress.on('change', (latest) => {
      setFrameIndex(Math.min(Math.floor(latest), totalFrames - 1));
    });

    return unsubscribe;
  }, [frameProgress, totalFrames]);

  // Fade out parallax background before About section so it never bleeds into later sections
  useEffect(() => {
    const updateOpacity = (latest) => {
      const fadeStart = Math.max(stopScrollPosition - 300, 0);
      if (latest >= stopScrollPosition) {
        heroOpacity.set(0);
      } else if (latest >= fadeStart && stopScrollPosition > fadeStart) {
        heroOpacity.set(1 - (latest - fadeStart) / (stopScrollPosition - fadeStart));
      } else {
        heroOpacity.set(1);
      }
    };

    updateOpacity(scrollY.get());
    const unsubscribe = scrollY.on('change', updateOpacity);
    return unsubscribe;
  }, [scrollY, stopScrollPosition, heroOpacity]);

  // Only enable mouse tracking on desktop
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseY, isMobile]);

  // Generate frame filename with zero padding
  const getFramePath = (index) => {
    const paddedIndex = String(index).padStart(3, '0');
    return `/assets/heroimg/frame_${paddedIndex}_delay-0.06s.jpg`;
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden pointer-events-none"
      style={{ opacity: heroOpacity }}
    >
      {/* Parallax Background Image with Scroll Tracking */}
      <motion.div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${getFramePath(frameIndex)}')`,
          y: !isMobile ? yOffset : 0, // Disable mouse parallax on mobile
        }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
      />

      {/* Gradient Overlay - Stronger on mobile for better text readability */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${
          isMobile
            ? 'from-black/20 via-black/40 to-black/80'
            : 'from-transparent via-black/30 to-black/70'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Secondary overlay for better text contrast - stronger on mobile */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isMobile
            ? 'from-black/50 via-black/20 to-black/50'
            : 'from-black/40 via-transparent to-black/40'
        }`}
      />
    </motion.div>
  );
};

export default ParallaxHero;