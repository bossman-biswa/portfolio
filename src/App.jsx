import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import SkeletonLoader from "./components/SkeletonLoader";
import ScrollToTop from "./components/ScrollToTop";
import { usePageLoad } from "./hooks/usePageLoad";

// Senior Architecture Optimization: Lazy-load below-the-fold sections
const About = lazy(() => import("./sections/About"));
const Skills = lazy(() => import("./sections/Skills"));
const Education = lazy(() => import("./sections/Education"));
const Projects = lazy(() => import("./sections/Projects"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));

const App = () => {
  const isLoading = usePageLoad();

  return (
    <>
      <div aria-hidden={isLoading}>
        <Navbar />
        <section id="hero">
          <Hero />
        </section>
        <main className="container mx-auto max-w-7xl">
          <Suspense fallback={<div className="min-h-[30vh]" />}>
            <section id="about">
              <About />
            </section>
            <section id="skills">
              <Skills />
            </section>
            <section id="education">
              <Education />
            </section>
            <section id="projects">
              <Projects />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <ScrollToTop />
      </div>

      <AnimatePresence>
        {isLoading && <SkeletonLoader key="skeleton" />}
      </AnimatePresence>
    </>
  );
};

export default App;
