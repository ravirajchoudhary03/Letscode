"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Bell,
  Search,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend
} from "recharts";
import { DotCube } from "@/components/DotCube";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const platformData = [
  { name: "Reddit", value: 6200, color: "#7DD3FC", icon: "/reddit-icon.png" }, // Sky blue
  { name: "Google Search", value: 4800, color: "#93C5FD", icon: "/google-icon.png" }, // Blue 300
  { name: "YouTube", value: 3520, color: "#60A5FA", icon: "/youtube-icon.png" }, // Blue 400
];

const shareOfVoiceData = [
  { name: "Zara", value: 45, mentions: 2700, color: "#5EEAD4" }, // Turquoise/Teal
  { name: "H&M", value: 30, mentions: 1800, color: "#D1D5DB" }, // Gray
  { name: "Calvin Klein", value: 15, mentions: 900, color: "#D9C9BA" }, // Beige/Tan
  { name: "Others", value: 10, mentions: 600, color: "#93A8BA" }, // Blue-gray
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Product mention frequency", icon: BarChart3 },
    { name: "Share of voice", icon: PieChart },
    { name: "Market index score", icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="scale-75 origin-left">
            <DotCube />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Marketecho</span>
        </div>

        <div className="px-4 py-2">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`w-full rounded-lg py-2 px-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'Overview' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
        </div>

        <nav className="flex-1 mt-2 px-3 space-y-1">
          {sidebarItems.slice(1).map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.name ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <item.icon size={18} />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
        {/* Header */}
        <header className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white">
              <Bell size={18} />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  {session.user?.image ? (
                    <div className="h-8 w-8 relative rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-500 mr-1" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-lg p-2 z-50 origin-top-right"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Users size={16} />
                Business Login
              </Link>
            )}
          </div>
        </header>

        {activeTab === "Overview" ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl text-center space-y-8"
            >
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                What brand do you want to track?
              </h2>
              <div className="relative shadow-xl rounded-2xl">
                <input
                  type="text"
                  placeholder="Enter brand name..."
                  className="w-full px-8 py-6 text-2xl rounded-2xl border-0 shadow-sm focus:outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                />
                <button className="absolute right-3 top-3 bottom-3 bg-black text-white px-8 rounded-xl font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2">
                  Track <ArrowRight size={18} />
                </button>
              </div>
              <p className="text-gray-400">
                Start by entering a brand, competitor, or keyword to analyze.
              </p>
            </motion.div>
          </div>
        ) : activeTab === "Product mention frequency" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  Product Mention Frequency
                </h1>
                <p className="text-sm text-gray-500">
                  Tracks how often a product is talked about online.
                </p>
              </div>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button className="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-md shadow-sm">Last 7 days</button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Last 30 days</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Mentions Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Total Mentions</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-bold text-gray-900">14,520</h2>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">↗ +12%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Across all platforms</p>
              </div>

              {/* Top Platform Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-2">Top Contributing Platform</p>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-4xl font-bold text-sky-800">Reddit</h2>
                  <span className="text-sky-600"><MessageSquare size={28} /></span>
                </div>
                <p className="text-xs text-gray-400">6,200 mentions</p>
              </div>
            </div>

            {/* Mention Counts by Platform Chart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Mention Counts by Platform</h3>
              <div className="space-y-8">
                {platformData.map((item, index) => (
                  <div key={item.name} className="relative">
                    <div className="flex items-center mb-2">
                      <div className="w-40 flex items-center gap-2 text-gray-600 font-medium">
                        {item.name === "Reddit" && <MessageSquare size={18} />}
                        {item.name === "Google Search" && <Search size={18} />}
                        {item.name === "YouTube" && <div className="w-4 h-3 bg-gray-600 rounded-sm" />} {/* Placeholder for Youtube Icon */}
                        {item.name}
                      </div>
                      <div className="flex-1 h-12 bg-gray-50 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / 7000) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: index === 0 ? '#7DD3FC' : index === 1 ? '#93C5FD' : '#64748B' }} // Using Tailwind colors approximating the screenshot
                        />
                      </div>
                      <div className="w-20 text-right font-bold text-gray-700 ml-4">
                        {item.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* X-Axis Labels Simulation */}
              <div className="flex justify-between pl-40 pr-20 mt-4 text-xs text-gray-400 border-t border-gray-100 pt-2">
                <span>0</span>
                <span>2k</span>
                <span>4k</span>
                <span>6k</span>
                <span>8k</span>
              </div>

              {/* Legend Simulation */}
              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7DD3FC]" />
                  <span className="text-sm text-gray-600">Reddit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#93C5FD]" />
                  <span className="text-sm text-gray-600">Google Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-sm text-gray-600">YouTube</span>
                </div>
              </div>
            </div>

          </motion.div>
        ) : activeTab === "Share of voice" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  Share of Voice (SOV)
                </h1>
                <p className="text-sm text-gray-500">
                  Represents a brand's share of total online mentions within its category.
                </p>
              </div>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button className="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-md shadow-sm">Last 7 days</button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">Last 30 days</button>
              </div>
            </div>

            {/* Formula Card */}
            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Share of Voice = (Brand Mentions / Total Category Mentions) × 100
                </p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-500 text-xs font-bold">
                i
              </div>
            </div>

            {/* Platform Tabs */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg font-medium">
                <MessageSquare size={16} /> Reddit
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-900">
                <Search size={16} /> Google
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-900">
                <div className="w-4 h-3 bg-gray-600 rounded-sm" /> YouTube
              </button>
              <span className="text-xs text-gray-400 ml-auto">Based on public online mentions</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center h-96">
                  <RechartsPieChart width={500} height={400}>
                    <Pie
                      data={shareOfVoiceData}
                      cx={250}
                      cy={180}
                      innerRadius={90}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {shareOfVoiceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                              <p className="font-bold text-gray-900">{payload[0].name}</p>
                              <p className="text-sm text-gray-600">{payload[0].value}% ({payload[0].payload.mentions.toLocaleString()} Mentions)</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                  {/* Center Text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold text-gray-900">45%</p>
                    <p className="text-sm text-gray-500 mt-1">Zara SOV</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 flex-wrap">
                  {shareOfVoiceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="space-y-6">
                {/* Your Brand's SOV Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Your Brand's SOV (%)
                  </p>
                  <h2 className="text-5xl font-bold text-gray-900 mb-2">45%</h2>
                  <p className="text-sm text-emerald-600 font-medium">↗ +8% from last week</p>
                </div>

                {/* Top Competitor Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Top Competitor by SOV
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">H&M</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    30% <span className="text-gray-400">━ No change</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
                {activeTab}
              </h1>
              <p className="text-sm text-gray-500">
                Detailed analysis and metrics module coming soon.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
