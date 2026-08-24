import React, { useState, useEffect } from 'react';

export default function KageProgressRail() {
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: '00' },
    { id: 'about', label: '01' },
    { id: 'projects', label: '02' },
    { id: 'techstack', label: '03' },
    { id: 'skills', label: '04' },
    { id: 'education', label: '05' },
    { id: 'contact', label: '06' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="kage-rail">
      {sections.map((sec) => (
        <button
          key={sec.id}
          className={activeSection === sec.id ? 'on' : ''}
          onClick={() => scrollTo(sec.id)}
          aria-label={`Scroll to ${sec.id}`}
        >
          <i />
        </button>
      ))}
    </div>
  );
}
