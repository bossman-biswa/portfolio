import React, { useEffect, useRef, useState } from 'react';

export default function KageCursor() {
  const dotRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currX = 0;
    let currY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('kage-chip') ||
        target.classList.contains('kage-card') ||
        target.classList.contains('les-row') ||
        target.classList.contains('kage-cta')
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    let animId;
    const loop = () => {
      currX += (mouseX - currX) * 0.2;
      currY += (mouseY - currY) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div ref={dotRef} className={`cur-dot ${isActive ? 'act' : ''}`} />;
}
