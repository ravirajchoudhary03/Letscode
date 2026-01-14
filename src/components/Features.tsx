"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: 1,
    title: "Product Mention Frequency",
    description: "Tracks how often a product is talked about online.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ecb049f2-a0ec-4073-9fec-831bcbfc8eb6/Screenshot-2026-01-15-032149-1768427581751.png",
  },
  {
    id: 2,
    title: "Share of Voice (SOV)",
    description: "Represents a brand's share of total online mentions within its category.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ecb049f2-a0ec-4073-9fec-831bcbfc8eb6/Screenshot-2026-01-15-032200-1768427574797.png",
  },
  {
    id: 3,
    title: "Market Index Score",
    description: "How strong is this product's digital presence compared to competitors?",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ecb049f2-a0ec-4073-9fec-831bcbfc8eb6/Screenshot-2026-01-15-032210-1768427568498.png",
  },
  {
    id: 4,
    title: "Platform Visibility",
    description: "Compares product visibility across platforms and benchmarks it against competitors.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ecb049f2-a0ec-4073-9fec-831bcbfc8eb6/Screenshot-2026-01-15-032228-1768427563333.png",
  },
];

export function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % features.length;
      }
      return prev === 0 ? features.length - 1 : prev - 1;
    });
  };

  const currentFeature = features[currentIndex];

  return (
    <section id="features" className="relative py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            What MarketEcho Offers
          </h2>
          <p className="text-[#4b5563] max-w-2xl mx-auto text-lg md:text-xl">
            A unified system to track brand visibility, measure share of voice, and understand competitive position across digital platforms.
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-2/3 relative h-[400px] md:h-[500px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-3xl" />
              
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10 bg-white cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={currentFeature.image}
                    alt={currentFeature.title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => paginate(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="lg:w-1/3 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    {currentFeature.title}
                  </h3>
                  <p className="text-[#4b5563] text-lg leading-relaxed">
                    {currentFeature.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 pt-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-emerald-500"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
