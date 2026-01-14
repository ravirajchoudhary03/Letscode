"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DotCube } from "./DotCube";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-black/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent py-5"
      )}
    >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <DotCube />
              Marketecho
            </Link>
          </div>

        <div className="hidden md:flex items-center gap-8">
          {["Home", "Features", "Metrics", "Use Cases"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <Globe size={16} />
            EN
            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
          </div>
          <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-md hover:bg-gray-200 transition-all active:scale-95">
            Business Login
          </button>
        </div>
      </div>
    </nav>
  );
}
