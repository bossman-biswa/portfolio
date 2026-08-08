import React from 'react';
import { motion } from 'motion/react';

const SkeletonBar = ({ className = '' }) => (
  <div className={`skeleton-bar ${className}`} />
);

const SkeletonLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-primary"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      aria-busy="true"
      aria-label="Loading page"
    >
      {/* Navbar skeleton */}
      <div className="fixed inset-x-0 z-10 border-b border-white/5 bg-primary/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between c-space py-4">
          <SkeletonBar className="h-7 w-20" />
          <div className="hidden gap-6 sm:flex">
            <SkeletonBar className="h-4 w-12" />
            <SkeletonBar className="h-4 w-12" />
            <SkeletonBar className="h-4 w-16" />
            <SkeletonBar className="h-4 w-14" />
          </div>
          <SkeletonBar className="h-6 w-6 sm:hidden" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="relative flex min-h-screen items-center c-space pt-20">
        <div className="absolute inset-0 skeleton-hero-bg" />

        <div className="relative z-10 w-full max-w-3xl space-y-6 md:mt-24">
          <SkeletonBar className="h-5 w-32 md:h-6 md:w-40" />
          <SkeletonBar className="h-10 w-56 md:h-14 md:w-72" />
          <SkeletonBar className="h-8 w-full max-w-md md:h-12 md:max-w-xl" />
          <SkeletonBar className="h-16 w-48 md:h-24 md:w-64" />
          <SkeletonBar className="h-6 w-64 md:h-10 md:w-80" />
        </div>
      </div>

      {/* Minimal section peek */}
      <div className="relative bg-minimal-bg px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-6">
          <SkeletonBar className="skeleton-bar-light h-3 w-16" />
          <SkeletonBar className="skeleton-bar-light h-8 w-48" />
          <SkeletonBar className="skeleton-bar-light h-4 w-full max-w-xl" />
          <div className="mt-10 grid grid-cols-1 gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="space-y-3 bg-surface p-8">
                <SkeletonBar className="skeleton-bar-light h-4 w-24" />
                <SkeletonBar className="skeleton-bar-light h-3 w-full max-w-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonLoader;
