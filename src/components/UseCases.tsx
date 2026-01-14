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
    icon: Package,
    title: "Product Teams",
    description: "Measure visibility and market response. Understand how product launches and updates are being received and discussed in your market.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative py-24 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built for Teams That Care About Market Position
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
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
              className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-600/10 flex items-center justify-center mb-6 group-hover:bg-emerald-600/20 transition-colors">
                <useCase.icon className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
              <p className="text-gray-400 leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
