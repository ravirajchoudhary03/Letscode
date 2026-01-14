"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function DotCube({ size = "small" }: { size?: "small" | "large" }) {
  const cubeSize = size === "small" ? 24 : 120;
  const dotSize = size === "small" ? 2 : 6;
  const gap = size === "small" ? 6 : 24;
  
  // Create a 3x3x3 grid of dots
  const layers = [-1, 0, 1];
  const dots = [];
  
  for (const z of layers) {
    for (const y of layers) {
      for (const x of layers) {
        dots.push({ x, y, z });
      }
    }
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: cubeSize, height: cubeSize }} />;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: cubeSize, 
        height: cubeSize,
        perspective: "1000px"
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 180],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative"
        style={{ 
          width: "100%", 
          height: "100%",
          transformStyle: "preserve-3d"
        }}
      >
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={false}
            animate={{
              x: dot.x * gap - (dotSize / 2),
              y: dot.y * gap - (dotSize / 2),
              z: dot.z * gap,
            }}
            style={{
              width: dotSize,
              height: dotSize,
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
