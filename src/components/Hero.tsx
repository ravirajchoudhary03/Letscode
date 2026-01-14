"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SlideInButton } from "./SlideInButton";
import { Typewriter } from "./Typewriter";
import { DotCube } from "./DotCube";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
        >
          Tracking how your brand <Typewriter text="echoes across the digital market" delay={500} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Measure visibility, compare competitors, and understand your true market presence across platforms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <Link href="/dashboard">
            <SlideInButton>
              Track Your Brand Now
            </SlideInButton>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
