"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart, 
  LineChart, 
  LogOut, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Activity,
  Bell
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { DotCube } from "@/components/DotCube";
import { TextScrambler } from "@/components/TextScrambler";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 600 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 900 },
  { name: "Sun", value: 1100 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Product mention frequency", icon: BarChart3 },
    { name: "Share of voice", icon: PieChart },
    { name: "Market index score", icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <DotCube />
          <span className="text-xl font-bold tracking-tight">MarketEcho</span>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.name
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <TextScrambler text="Your Market Presence" />
            </h1>
            <p className="text-gray-400">
              Measure visibility, compare competitors, and understand your true market presence across platforms.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Mentions", value: "12.5k", trend: "+12%", icon: MessageSquare },
            { label: "Sentiment Score", value: "84", trend: "+5%", icon: Activity },
            { label: "Market Share", value: "24.2%", trend: "+2.4%", icon: TrendingUp },
            { label: "Active Channels", value: "18", trend: "0%", icon: Users },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <stat.icon size={20} />
                </div>
                <span className="text-xs font-medium text-emerald-500">{stat.trend}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Visibility Trend</h3>
              <div className="flex gap-2">
                {["7d", "30d", "90d"].map((range) => (
                  <button key={range} className="px-3 py-1 text-xs rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/30">
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #ffffff10', borderRadius: '8px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
            <h3 className="text-lg font-semibold mb-6">Market Share Distribution</h3>
            <div className="space-y-6">
              {[
                { name: "Your Brand", share: 45, color: "bg-emerald-500" },
                { name: "Competitor A", share: 25, color: "bg-blue-500" },
                { name: "Competitor B", share: 20, color: "bg-purple-500" },
                { name: "Others", share: 10, color: "bg-gray-500" },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{item.name}</span>
                    <span className="font-medium">{item.share}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={mounted ? { width: `${item.share}%` } : { width: 0 }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
