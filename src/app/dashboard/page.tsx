"use client";

import { useState } from "react";
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
  Bell,
  Search
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { DotCube } from "@/components/DotCube";
import Link from "next/link";

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
          <button className="w-full bg-emerald-50 text-emerald-600 rounded-lg py-2 px-3 text-sm font-medium flex items-center gap-2">
            <LayoutDashboard size={16} />
            Overview
          </button>
        </div>

        <nav className="flex-1 mt-2 px-3 space-y-1">
          {sidebarItems.slice(1).map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
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
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
              Brand Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Monitor your brand's digital echo in real-time.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search brands..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white">
              <Bell size={18} />
            </button>
            <Link href="/login" className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Users size={16} />
              Business Login
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Mentions", value: "24.5k", trend: "+12.5%", isPositive: true },
            { label: "Brand Sentiment", value: "82%", trend: "+4.2%", isPositive: true },
            { label: "Market Share", value: "18.4%", trend: "-0.8%", isPositive: false },
            { label: "Active Channels", value: "12", trend: "+2", isPositive: true },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500 mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.isPositive ? '↗' : '↘'} {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Visibility Trend</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {["7D", "1M", "3M", "1Y"].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === '1M' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full relative">
              {/* Placeholder illustration for the chart based on screenshot */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                  <TrendingUp size={24} />
                </div>
                <p className="text-sm text-gray-400">Chart visualization will be rendered here...</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Sentiment Analysis</h3>
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
                <PieChart size={24} />
              </div>
              <p className="text-sm text-gray-400">Distribution chart will be rendered here...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
