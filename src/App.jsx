import React, { useState } from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import TechStack from './sections/TechStack';
import Skills from './sections/Skills';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import KageWorldCanvas from './components/KageWorldCanvas';
import KagePreloader from './components/KagePreloader';
import KageProgressRail from './components/KageProgressRail';
import KageCursor from './components/KageCursor';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-[#05070a] text-[#dfe7e0] selection:bg-[#e0231c] selection:text-white relative font-['Onest',sans-serif]">
      {/* Preloader */}
      <KagePreloader />

      {/* Full-Page Cinematic Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/kage_cinematic_bg.png"
          alt="Kyoto Temple Cinematic Background"
          className="w-full h-full object-cover opacity-75 scale-105 filter contrast-115 brightness-95 saturate-110"
        />
        {/* Cinematic Vignette & Ambient Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/60 via-transparent to-[#05070a]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#05070a_90%)]" />
        <div className="absolute inset-0 bg-radial from-[#e0231c]/10 via-transparent to-transparent mix-blend-screen" />
      </div>

      {/* 3D WebGL World Canvas (Particles, Leaves, Volumetric Lights & Camera Rig) */}
      <KageWorldCanvas activeSection={activeSection} />

      {/* Atmospheric Overlays (Grain & Vignette) */}
      <div id="grain-overlay" />
      <div id="vignette-overlay" />

      {/* Interactive Custom Cursor */}
      <KageCursor />

      {/* Right Side Progress Rail */}
      <KageProgressRail />

      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Page Content Layer */}
      <main className="page relative z-10">
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Skills />
        <Education />
        <Contact />
      </main>

      {/* Kage Editorial Footer */}
      <Footer />
    </div>
  );
}
