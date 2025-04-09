'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  hasParallax?: boolean;
  bgImage?: string;
}

export default function AnimatedSection({ 
  children, 
  className = '', 
  index,
  hasParallax = false,
  bgImage
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [50, 0, 0, 50]
  );

  // Parallax effect for background
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '20%']
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{
        opacity,
        scale,
        y
      }}
      className={`section flex items-center justify-center relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.32, 0.72, 0, 1]
      }}
    >
      {/* Background with parallax */}
      {hasParallax && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            y: bgY,
            backgroundImage: bgImage ? `url(${bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />

      {/* Glass effect container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="glass p-8 rounded-3xl">
          {children}
        </div>
      </div>

      {/* Animated gradient blur */}
      <div className="gradient-blur" />
    </motion.section>
  );
} 