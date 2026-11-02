"use client";

import React, { useState, useEffect } from "react";
import { BellIcon, SearchIcon } from "./Icons";

export default function Header() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border-light shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Left Side: Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center shadow-xs">
            <span className="text-gold font-heading text-lg font-bold">C</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-navy text-base sm:text-lg font-bold tracking-tight">
                Community Analytics
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest/10 text-forest font-medium">
                ศรีสะเกษ
              </span>
            </div>
            <p className="text-slate text-[11px] sm:text-xs">
              ภาพรวมข้อมูลสถิติผู้ป่วยบำบัดและชุมชนเป้าหมาย
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-cream-light/60 rounded-lg px-3 py-1.5 border border-border-light focus-within:border-navy focus-within:bg-white transition-all">
            <SearchIcon size={15} className="text-slate" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="bg-transparent text-xs text-navy placeholder:text-slate/60 w-36 outline-none"
            />
          </div>

          {/* Notification */}
          <button
            className="relative p-2 rounded-lg text-slate hover:text-navy hover:bg-cream-light transition-colors"
            aria-label="การแจ้งเตือน"
          >
            <BellIcon size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Date Badge */}
          {dateStr && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream-light/60 border border-border-light">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-slate font-medium">{dateStr}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
