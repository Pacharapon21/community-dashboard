"use client";

import React, { useState } from "react";
import {
  DashboardIcon,
  ChartIcon,
  TableIcon,
  MapIcon,
  SettingsIcon,
  CloseIcon,
  PieChartIcon,
} from "./Icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "dashboard", label: "ภาพรวม", icon: DashboardIcon, active: true },
  { id: "analytics", label: "วิเคราะห์ข้อมูล", icon: ChartIcon, active: false },
  { id: "reports", label: "รายงาน", icon: PieChartIcon, active: false },
  { id: "data", label: "ข้อมูลดิบ", icon: TableIcon, active: false },
  { id: "map", label: "แผนที่", icon: MapIcon, active: false },
  { id: "settings", label: "ตั้งค่า", icon: SettingsIcon, active: false },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay lg:hidden ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="sidebar-logo px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-heading text-lg font-bold">C</span>
            </div>
            <div>
              <h1 className="text-white font-heading text-[15px] font-semibold tracking-wide leading-tight">
                Community
              </h1>
              <p className="text-white/40 text-[11px] tracking-widest uppercase mt-0.5">
                Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30">
            เมนูหลัก
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-xs font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">Admin</p>
              <p className="text-white/40 text-xs truncate">admin@community.go.th</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
