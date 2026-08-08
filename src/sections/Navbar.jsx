import { useState } from 'react';
import { motion } from 'motion/react';

function Navigation() {
  const links = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <ul className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            className="font-montserrat text-xs uppercase tracking-[0.25em] text-white/70 hover:text-[color:var(--color-gold-light)] transition-colors duration-300 relative py-1 group font-medium"
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[color:var(--color-gold)] transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
      ))}
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full backdrop-blur-xl bg-[#0a0908]/80 border-b border-[color:var(--color-gold)]/20 shadow-2xl">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Luxury Brandmark */}
          <a href="/" className="flex items-center gap-3 group">
            <span className="w-2 h-2 rounded-full bg-[color:var(--color-gold)] group-hover:scale-125 transition-transform" />
            <span className="font-montserrat text-lg sm:text-xl font-semibold tracking-[0.1em] text-white group-hover:text-[color:var(--color-gold-light)] transition-colors">
              BISWAKALYAN
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-8">
            <Navigation />
            <a
              href="#contact"
              className="font-montserrat px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-light)] border border-[color:var(--color-gold)]/40 rounded-full hover:bg-[color:var(--color-gold)] hover:text-black transition-all duration-300 shadow-md shadow-[color:var(--color-gold)]/10"
            >
              Hire Me
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="flex cursor-pointer text-white/80 hover:text-[color:var(--color-gold)] focus:outline-none sm:hidden"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6 invert"
              alt={isOpen ? "Close menu" : "Open menu"}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden bg-[#0a0908]/95 border-t border-[color:var(--color-gold)]/20 py-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex justify-center">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
