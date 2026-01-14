"use client";

import { motion } from "framer-motion";
import { Globe, BarChart3, Users, TrendingUp, Filter, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Cross-Platform Brand Tracking",
    description: "Track how often and where your brand appears across search, social media, and public content sources.",
  },
  {
    icon: BarChart3,
    title: "Share of Voice (SOV) Analysis",
    description: "Understand how much attention your brand captures compared to competitors within the same category.",
  },
  {
    icon: Users,
    title: "Competitor Benchmarking",
    description: "Automatically identify rival brands and compare visibility, mentions, and engagement metrics.",
  },
  {
    icon: TrendingUp,
    title: "Market Index Score",
    description: "A normalized score combining frequency, engagement, and competitive visibility into a single market indicator.",
  },
  {
    icon: Filter,
    title: "Noise & Duplicate Filtering",
    description: "Filters irrelevant, duplicate, and low-quality mentions to ensure accurate and meaningful analysis.",
  },
  {
    icon: LayoutDashboard,
    title: "Actionable Insights Dashboard",
    description: "Visualize trends, dominance, and market position through an intuitive, decision-ready dashboard.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What MarketEcho Offers
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A unified system to track brand visibility, measure share of voice, and understand competitive position across digital platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-600/10 flex items-center justify-center mb-4 group-hover:bg-emerald-600/20 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
