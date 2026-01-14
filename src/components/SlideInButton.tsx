"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideInButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SlideInButton({ children, className, onClick }: SlideInButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden group px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg text-lg transition-all duration-200 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-emerald-500"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </motion.button>
  );
}
