import React, { useEffect, useState } from 'react';

export const LetterSwapWords = ({ words = [], duration = 3000, className = '', textAlign = 'left' }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[wordIndex % words.length] || '';
  const displayText = currentWord.slice(0, charIndex);
  const typingSpeed = Math.max(80, Math.round(duration / 20));

  useEffect(() => {
    if (!words.length) return undefined;

    const isWordComplete = !isDeleting && charIndex === currentWord.length;
    const isWordCleared = isDeleting && charIndex === 0;
    const waitTime = isWordComplete ? 1200 : isWordCleared ? 400 : typingSpeed;

    const timer = window.setTimeout(() => {
      if (isWordComplete) {
        setIsDeleting(true);
        return;
      }

      if (isWordCleared) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }

      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, waitTime);

    return () => window.clearTimeout(timer);
  }, [charIndex, currentWord.length, isDeleting, words.length, wordIndex, typingSpeed]);

  useEffect(() => {
    if (!isDeleting && charIndex === 0) {
      setCharIndex(1);
    }
  }, [charIndex, isDeleting]);

  return (
    <div className={className} style={{ textAlign }}>
      <span>{displayText}</span>
      <span className="inline-block ml-1 w-px h-[1.1em] bg-white/90 animate-pulse" aria-hidden="true" />
    </div>
  );
};
