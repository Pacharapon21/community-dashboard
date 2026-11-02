"use client";

import React from "react";
import { SummaryStats } from "@/app/lib/types";
import {
  UsersIcon,
  HomeIcon,
  BuildingIcon,
  ChartIcon,
  TrendUpIcon,
  TrendDownIcon,
} from "./Icons";

interface SummaryCardsProps {
  stats: SummaryStats;
  selectedYear: string;
  selectedDistrict: string;
  isLoading?: boolean;
}

export default function SummaryCards({
  stats,
  selectedYear,
  selectedDistrict,
  isLoading = false,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="dashboard-card p-5 animate-pulse bg-white/70"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-cream-light" />
              <div className="w-14 h-5 rounded-full bg-cream-light" />
            </div>
            <div className="w-24 h-3 bg-cream-light rounded mb-2" />
            <div className="w-32 h-8 bg-cream-light rounded mb-2" />
            <div className="w-40 h-2.5 bg-cream-light rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "villages",
      title: "หมู่บ้าน/ชุมชนเป้าหมาย",
      value: stats.totalVillages.toLocaleString(),
      unit: "แห่ง",
      change: stats.villagesChange,
      note: stats.villageNote,
      icon: HomeIcon,
      bgClass: "bg-forest/10 text-forest",
    },
    {
      id: "patients",
      title: "ผู้ป่วยเข้ารับบำบัด",
      value: stats.totalPatients.toLocaleString(),
      unit: "คน",
      change: stats.patientsChange,
      note:
        selectedYear === "ทั้งหมด"
          ? "รวมผู้ป่วยบำบัดทุกปีที่บันทึก"
          : `ผู้ป่วยเข้ารับการบำบัดในปี ${selectedYear}`,
      icon: UsersIcon,
      bgClass: "bg-navy/10 text-navy",
    },
    {
      id: "districts",
      title: "พื้นที่ดำเนินงาน",
      value: stats.totalDistricts.toLocaleString(),
      unit: "อำเภอ",
      change: null,
      note:
        selectedDistrict === "ทั้งหมด"
          ? `ครอบคลุม ${stats.totalDistricts} จาก 22 อำเภอ`
          : `อำเภอ${selectedDistrict}`,
      icon: BuildingIcon,
      bgClass: "bg-slate/10 text-slate-dark",
    },
    {
      id: "years",
      title: "ช่วงปีที่มีข้อมูล",
      value: stats.totalYears.toLocaleString(),
      unit: "ปี",
      change: null,
      note:
        selectedYear === "ทั้งหมด"
          ? "พ.ศ. 2565 - 2568 (4 รอบปี)"
          : `ข้อมูลประจำปี พ.ศ. ${selectedYear}`,
      icon: ChartIcon,
      bgClass: "bg-gold/15 text-gold-dark",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const hasChange = card.change !== null && card.change !== undefined;
        const isPositive = hasChange && (card.change ?? 0) >= 0;

        return (
          <div
            key={card.id}
            className={`dashboard-card summary-card p-5 animate-fade-in stagger-${
              idx + 1
            }`}
          >
            <div className="flex items-start justify-between mb-3.5">
              <div className={`summary-card-icon ${card.bgClass}`}>
                <Icon size={22} />
              </div>
              {hasChange && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    isPositive
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                  title={`เทียบกับปีก่อนหน้า (${card.change! > 0 ? "+" : ""}${card.change}%)`}
                >
                  {isPositive ? (
                    <TrendUpIcon size={12} />
                  ) : (
                    <TrendDownIcon size={12} />
                  )}
                  <span>{Math.abs(card.change!)}%</span>
                </div>
              )}
            </div>

            <p className="text-slate text-xs font-medium uppercase tracking-wider mb-1.5">
              {card.title}
            </p>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-heading text-2xl lg:text-[28px] font-bold text-navy tracking-tight">
                {card.value}
              </span>
              <span className="text-xs text-slate font-medium">{card.unit}</span>
            </div>

            <p className="text-[11px] text-slate/70 truncate" title={card.note}>
              {card.note}
            </p>
          </div>
        );
      })}
    </div>
  );
}
