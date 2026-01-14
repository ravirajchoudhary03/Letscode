"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const sovData = [
  { name: "Your Brand", value: 42, color: "#10b981" },
  { name: "Competitor A", value: 28, color: "#3b82f6" },
  { name: "Competitor B", value: 18, color: "#8b5cf6" },
  { name: "Others", value: 12, color: "#6b7280" },
];

const platformData = [
  { platform: "Search", visibility: 85 },
  { platform: "Twitter", visibility: 72 },
  { platform: "LinkedIn", visibility: 68 },
  { platform: "News", visibility: 54 },
];

const metrics = [
  {
    title: "Share of Voice (SOV)",
    description: "Measures the percentage of total market conversations that mention your brand compared to competitors.",
    chart: "pie",
  },
  {
    title: "Total Mentions",
    value: "24,847",
    change: "+12.4%",
    description: "The total count of brand mentions across all tracked platforms over a given period.",
  },
  {
    title: "Market Index Score",
    value: "78",
    max: "100",
    description: "A composite score reflecting brand visibility, engagement quality, and competitive standing.",
  },
  {
    title: "Platform-wise Visibility",
    description: "Breakdown of brand presence across different digital platforms and channels.",
    chart: "bar",
  },
];

export function Metrics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="metrics" className="relative py-24 px-6 bg-[#061a14]">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Core Metrics That Matter
          </h2>
          <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg">
            Clear, actionable insights into your brand&apos;s market position.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Share of Voice (SOV)</h3>
            <p className="text-emerald-100/60 text-sm mb-8">{metrics[0].description}</p>
            <div className="h-56">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sovData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {sovData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : entry.color} opacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#061a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {sovData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: index === 0 ? "#10b981" : item.color }} />
                  <span className="text-xs text-emerald-100/70">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Total Mentions</h3>
            <p className="text-emerald-100/60 text-sm mb-8">{metrics[1].description}</p>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold text-white tracking-tighter">{metrics[1].value}</span>
              <span className="text-emerald-400 text-xl font-medium">{metrics[1].change}</span>
            </div>
            <p className="text-emerald-100/40 text-sm mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time tracking active
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Market Index Score</h3>
            <p className="text-emerald-100/60 text-sm mb-8">{metrics[2].description}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold text-white tracking-tighter">{metrics[2].value}</span>
              <span className="text-emerald-100/40 text-2xl">/ {metrics[2].max}</span>
            </div>
            <div className="mt-8 h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "78%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Platform-wise Visibility</h3>
            <p className="text-emerald-100/60 text-sm mb-8">{metrics[3].description}</p>
            <div className="h-56">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical" margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="platform" 
                      type="category" 
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} 
                      width={80}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{ backgroundColor: '#061a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar 
                      dataKey="visibility" 
                      fill="#10b981" 
                      radius={[0, 6, 6, 0]} 
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
