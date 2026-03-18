'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Entry: blur 10px -> 0px, opacity 0 -> 1 (from 0 to 0.3 of scroll progress)
  // Center: blur 0px, opacity 1 (from 0.3 to 0.7 of scroll progress)
  // Exit: blur 0px -> 10px, opacity 1 -> 0 (from 0.7 to 1 of scroll progress)
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [10, 0, 0, 10]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.95, 1, 1, 0.95]
  );

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <motion.section
      id={id}
      ref={containerRef}
      style={{
        opacity,
        filter,
        scale,
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}
