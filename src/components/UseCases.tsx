"use client";

import { motion } from "framer-motion";
import { Rocket, Target, Package } from "lucide-react";

const useCases = [
  {
    icon: Rocket,
    title: "Startups",
    description: "Understand brand awareness and early traction. Track how your startup is being discovered and mentioned across digital channels to validate market fit.",
  },
  {
    icon: Target,
    title: "Marketing Teams",
    description: "Track campaigns and competitive positioning. Measure the impact of your marketing efforts and see how you stack up against competitors in real-time.",
  },
  {
    icon: Rocket, // Changed from Package to match Rocket style or keep it consistent
    title: "Product Teams",
    description: "Measure visibility and market response. Understand how product launches and updates are being received and discussed in your market.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative py-24 px-6 bg-white z-10">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Built for Teams That Care About Market Position
          </h2>
          <p className="text-[#4b5563] max-w-2xl mx-auto text-lg md:text-xl">
            Whether you&apos;re launching or scaling, MarketEcho provides the insights you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-emerald-900/[0.05] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center mb-8">
                <useCase.icon className="w-6 h-6 text-[#059669]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">{useCase.title}</h3>
              <p className="text-[#4b5563] text-base leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
