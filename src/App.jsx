import React from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const App = () => {
  return <>
    <Navbar />
    <div className="container mx-auto max-w-7xl">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
    <Footer />
  </>;
};

export default App;