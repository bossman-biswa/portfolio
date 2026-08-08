import React, { useState, useEffect } from 'react';
import ParallaxHero from '../components/ParallaxHero';
import ParticleSwarm from '../components/ParticleSwarm';
import TiltCard from '../components/TiltCard';
import { motion, AnimatePresence } from 'motion/react';

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [taglineIndex, setTaglineIndex] = useState(0);

    const taglines = [
        "Architecting Digital Elegance",
        "Building Scalable Full-Stack Systems",
        "Crafting Interactive 3D WebGL Experiences",
    ];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [taglines.length]);

    const luxuryHighlights = [
        'FULL-STACK ARCHITECTURE',
        '3D WEBGL SIMULATIONS',
        'REACT NATIVE MOBILE',
        'NODE.JS DISTRIBUTED SYSTEMS',
        'DOCKER & CONTAINERIZATION',
        'B.TECH COMPUTER SCIENCE @ ITER',
    ];

    const titleLetters = "Biswakalyan".split("");

    return (
        <div className="relative overflow-hidden bg-[#0a0908] min-h-screen flex flex-col justify-between pt-24 sm:pt-28">
            <ParallaxHero />
            <ParticleSwarm isMobile={isMobile} />

            {/* Ambient Gold & Lavender Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[color:var(--color-gold)]/10 rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[color:var(--color-hero-accent)]/10 rounded-full blur-[140px] pointer-events-none z-0" />

            {/* Main Hero Container */}
            <div className="relative z-10 mx-auto c-space max-w-7xl w-full flex-1 flex flex-col justify-center py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Luxury Typography & CTAs */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 border border-[color:var(--color-gold)]/30 rounded-full bg-[color:var(--color-gold)]/5 backdrop-blur-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-gold)]" />
                            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[color:var(--color-gold-light)]">
                                Full-Stack & 3D WebGL Developer
                            </span>
                        </motion.div>

                        {/* Animated Title & Tagline */}
                        <div className="space-y-1">
                            <motion.h1
                                className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-white flex flex-wrap items-center cursor-default select-none"
                                initial="hidden"
                                animate="visible"
                            >
                                {titleLetters.map((char, index) => (
                                    <motion.span
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 40, rotateX: -60 },
                                            visible: { opacity: 1, y: 0, rotateX: 0 }
                                        }}
                                        transition={{ duration: 0.6, delay: 0.3 + index * 0.04, ease: [0.215, 0.61, 0.355, 1] }}
                                        className="inline-block hover:text-[color:var(--color-gold-light)] hover:-translate-y-2 transition-all duration-300 transform-gpu"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="text-gold-gradient inline-block animate-pulse ml-1"
                                >
                                    .
                                </motion.span>
                            </motion.h1>

                            {/* Rotating Tagline with Satisfy font */}
                            <div className="h-12 sm:h-14 overflow-hidden relative pt-2">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={taglineIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.55, ease: "easeInOut" }}
                                        className="font-satisfy text-3xl sm:text-4xl lg:text-5xl text-[color:var(--color-gold-light)] tracking-wide absolute left-0 drop-shadow-md"
                                    >
                                        {taglines[taglineIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="font-baskerville text-sm sm:text-base text-white/70 max-w-xl font-light leading-relaxed pt-2"
                        >
                            B.Tech Computer Science student seeking internship opportunities. Specialized in building high-performance full-stack web platforms, mobile applications, and interactive 3D simulations.
                        </motion.p>

                        {/* CTA Buttons & Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="pt-4 space-y-8"
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <a
                                    href="#projects"
                                    className="font-montserrat px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] bg-[color:var(--color-gold)] text-black rounded-full hover:bg-[color:var(--color-gold-light)] hover:scale-105 transition-all duration-300 shadow-lg shadow-[color:var(--color-gold)]/20"
                                >
                                    Explore Works →
                                </a>
                                <a
                                    href="#contact"
                                    className="font-montserrat px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white border border-white/25 rounded-full hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)] hover:scale-105 transition-all duration-300"
                                >
                                    Get In Touch
                                </a>
                            </div>

                            {/* Luxury Stat Callouts */}
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
                                <div>
                                    <p className="font-serif-luxury text-2xl sm:text-3xl text-gold-gradient">25K+</p>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50">WebGL Particles</p>
                                </div>
                                <div>
                                    <p className="font-serif-luxury text-2xl sm:text-3xl text-gold-gradient">3rd Yr</p>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50">B.Tech CS @ ITER</p>
                                </div>
                                <div>
                                    <p className="font-serif-luxury text-2xl sm:text-3xl text-gold-gradient">100%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50">Scalable Code</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive Luxury Glass Spec Card */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <TiltCard className="!bg-[#0c0b0a]/90 backdrop-blur-2xl border border-[color:var(--color-gold)]/30 rounded-md p-8 sm:p-9 space-y-7 shadow-2xl text-white transition-colors duration-500 hover:border-[color:var(--color-gold)]/60">
                                {/* Header Row */}
                                <div className="flex items-center justify-between pb-4 border-b border-[color:var(--color-gold)]/20">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        <span className="font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
                                            STATUS: OPEN FOR INTERNSHIPS
                                        </span>
                                    </div>
                                    <span className="font-montserrat text-xs tracking-widest text-[color:var(--color-gold-light)]/80 font-medium">
                                        2023 — 2027
                                    </span>
                                </div>

                                {/* Body Content */}
                                <div className="space-y-6 text-white/90">
                                    <div>
                                        <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-light)]/60 mb-1">
                                            ENGINEERING PROFILE
                                        </p>
                                        <p className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide leading-tight">
                                            Junior Software & Full-Stack Developer
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-light)]/60 mb-3">
                                            TECHNICAL CAPABILITIES
                                        </p>
                                        <ul className="space-y-2.5 font-oxygen text-sm font-light text-white/80">
                                            <li className="flex items-center gap-3 group/item">
                                                <span className="text-[color:var(--color-gold)] text-xs group-hover/item:scale-125 transition-transform duration-200">◆</span>
                                                <span className="group-hover/item:text-white transition-colors">React, Node.js, Express & Next.js</span>
                                            </li>
                                            <li className="flex items-center gap-3 group/item">
                                                <span className="text-[color:var(--color-gold)] text-xs group-hover/item:scale-125 transition-transform duration-200">◆</span>
                                                <span className="group-hover/item:text-white transition-colors">Three.js 3D WebGL Swarm Simulations</span>
                                            </li>
                                            <li className="flex items-center gap-3 group/item">
                                                <span className="text-[color:var(--color-gold)] text-xs group-hover/item:scale-125 transition-transform duration-200">◆</span>
                                                <span className="group-hover/item:text-white transition-colors">React Native Mobile Applications</span>
                                            </li>
                                            <li className="flex items-center gap-3 group/item">
                                                <span className="text-[color:var(--color-gold)] text-xs group-hover/item:scale-125 transition-transform duration-200">◆</span>
                                                <span className="group-hover/item:text-white transition-colors">MongoDB, MySQL, GraphQL & Docker</span>
                                            </li>
                                            <li className="flex items-center gap-3 group/item">
                                                <span className="text-[color:var(--color-gold)] text-xs group-hover/item:scale-125 transition-transform duration-200">◆</span>
                                                <span className="group-hover/item:text-white transition-colors">Java, JavaScript & System Architecture</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer Bar */}
                                <div className="pt-4 border-t border-[color:var(--color-gold)]/20 flex items-center justify-between font-montserrat text-[10px] uppercase tracking-widest text-white/40">
                                    <span>INSTITUTE: ITER, BHUBANESWAR</span>
                                    <span className="text-[color:var(--color-gold-light)] font-semibold tracking-widest">EDITION NO. 01</span>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom Luxury Marquee Ribbon */}
            <div className="relative z-10 border-t border-[color:var(--color-gold)]/20 bg-[#0f0d0b]/90 py-3 overflow-hidden select-none backdrop-blur-md">
                <div className="animate-marquee gap-10 items-center text-xs font-mono font-medium tracking-[0.25em] text-[color:var(--color-gold-light)]/70">
                    {[...luxuryHighlights, ...luxuryHighlights].map((item, idx) => (
                        <span key={idx} className="flex items-center gap-4 hover:text-[color:var(--color-gold-light)] transition-colors cursor-pointer whitespace-nowrap">
                            <span className="text-[color:var(--color-gold)]">◆</span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
