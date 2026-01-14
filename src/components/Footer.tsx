"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DotCube } from "./DotCube";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative py-12 px-6 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
              <DotCube />
              MarketEcho
            </Link>
            <p className="text-gray-500 text-sm mt-2">
              Advanced digital market analytics and tracking.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-gray-500 text-sm">
            &copy; {year || "2026"} MarketEcho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
