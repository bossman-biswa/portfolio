import React, { useState, useEffect } from 'react';
import HeroText from '../components/HeroText';
import ParallaxHero from '../components/ParallaxHero';
import { motion } from 'motion/react';

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative">
            {/* Parallax Background Component */}
            <ParallaxHero />

            {/* Hero Content */}
            <section className="relative z-10 flex items-center justify-center md:items-start md:justify-start min-h-screen overflow-hidden c-space px-4 md:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full"
                >
                    <HeroText />
                </motion.div>
            </section>

            {/* Scroll Indicator - Hidden on mobile for cleaner look */}
            {!isMobile && (
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <svg
                        className="w-6 h-6 text-white opacity-70 hover:opacity-100 transition-opacity"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </motion.div>
            )}
        </div>
    )
};

export default Hero;