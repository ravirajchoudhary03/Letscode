"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

function TrailLogo({ className = "w-6 h-6" }: { className?: string }) {
  const size = 3;
  const dots = [];
  for (let x = 0; x <= size; x++) {
    for (let y = 0; y <= size; y++) {
      dots.push({ x, y, z: size });
    }
  }

  return (
    <div className={`relative ${className} flex items-center justify-center opacity-40`}>
      <svg viewBox="-12 -15 24 30" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="trailDotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </radialGradient>
        </defs>
        {dots.map((p, i) => {
          const isoX = (p.x - p.y) * 2.5;
          const isoY = (p.x + p.y) * 1.5 - p.z * 3;
          return (
            <circle
              key={i}
              cx={isoX}
              cy={isoY}
              r={0.6}
              fill="url(#trailDotGradient)"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function TrailCursor() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const id = idCounter.current++;
      setPoints((prev) => [{ x: e.clientX, y: e.clientY, id }, ...prev].slice(0, 10));
      
      setTimeout(() => {
        setPoints((prev) => prev.filter((p) => p.id !== id));
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            className="absolute left-0 top-0"
            initial={{ opacity: 0.6, scale: 1, x: point.x - 12, y: point.y - 12 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TrailLogo />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <TrailLogo className="w-8 h-8 opacity-100" />
      </motion.div>
    </div>
  );
}
