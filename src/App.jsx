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
    <main className="container mx-auto max-w-7xl">
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="projects"><Projects /></section>
      <section id="contact"><Contact /></section>
    </main>
    <Footer />
  </>;
};

export default App;