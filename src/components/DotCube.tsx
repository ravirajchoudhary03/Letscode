"use client";

import { motion } from "framer-motion";

export function DotCube({ size = "small" }: { size?: "small" | "large" }) {
  const containerSize = size === "small" ? 28 : 120;
  const dotSize = size === "small" ? 1.8 : 5;
  const gap = size === "small" ? 4.5 : 18;
  
  // Create a 4x4x4 grid of dots for high density like the video
  const count = 4;
  const dots = [];
  
  for (let z = 0; z < count; z++) {
    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        dots.push({ 
          x: x - (count - 1) / 2, 
          y: y - (count - 1) / 2, 
          z: z - (count - 1) / 2 
        });
      }
    }
  }

  return (
    <div 
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{ 
        width: containerSize, 
        height: containerSize,
        perspective: "600px"
      }}
    >
      <motion.div
        initial={{ rotateX: 45, rotateY: 45, scale: 0 }}
        animate={{ 
          rotateX: [45, 45 + 360],
          rotateY: [45, 45 + 720],
          scale: 1 
        }}
        transition={{
          rotateX: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
          rotateY: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1,
            ease: "easeOut"
          }
        }}
        className="relative"
        style={{ 
          width: "100%", 
          height: "100%",
          transformStyle: "preserve-3d"
        }}
      >
        {dots.map((dot, i) => {
          // Calculate delay based on distance from center for "expanding" effect
          const distance = Math.sqrt(dot.x ** 2 + dot.y ** 2 + dot.z ** 2);
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              style={{
                width: dotSize,
                height: dotSize,
                left: "50%",
                top: "50%",
                x: dot.x * gap - (dotSize / 2),
                y: dot.y * gap - (dotSize / 2),
                z: dot.z * gap,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.4, 0.8],
                scale: [0, 1.2, 1] 
              }}
              transition={{
                delay: distance * 0.1,
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 2
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
