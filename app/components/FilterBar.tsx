"use client";

import React from "react";
import { CalendarIcon, FilterIcon } from "./Icons";

interface FilterBarProps {
  years: string[];
  districts: string[];
  selectedYear: string;
  selectedDistrict: string;
  onYearChange: (year: string) => void;
  onDistrictChange: (district: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalFilteredRows?: number;
  dataSource?: string;
  isFallback?: boolean;
}

export default function FilterBar({
  years,
  districts,
  selectedYear,
  selectedDistrict,
  onYearChange,
  onDistrictChange,
  onRefresh,
  isRefreshing = false,
  totalFilteredRows = 0,
  dataSource = "Google Sheets",
  isFallback = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white/70 backdrop-blur-sm rounded-xl border border-border-light shadow-xs animate-fade-in stagger-1">
      <div className="flex flex-wrap items-center gap-3">
        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-slate flex-shrink-0" />
          <label
            htmlFor="year-filter"
            className="text-xs text-slate font-medium whitespace-nowrap"
          >
            ปี พ.ศ.
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="filter-select text-xs py-1.5 px-3 rounded-lg border border-border bg-white text-navy font-medium focus:outline-none focus:border-navy"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === "ทั้งหมด" ? "ปีทั้งหมด" : `พ.ศ. ${year}`}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2">
          <FilterIcon size={16} className="text-slate flex-shrink-0" />
          <label
            htmlFor="district-filter"
            className="text-xs text-slate font-medium whitespace-nowrap"
          >
            อำเภอ
          </label>
          <select
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="filter-select text-xs py-1.5 px-3 rounded-lg border border-border bg-white text-navy font-medium focus:outline-none focus:border-navy"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district === "ทั้งหมด" ? "ทุกอำเภอ" : `อ. ${district}`}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Reset if filters applied */}
        {(selectedYear !== "ทั้งหมด" || selectedDistrict !== "ทั้งหมด") && (
          <button
            onClick={() => {
              onYearChange("ทั้งหมด");
              onDistrictChange("ทั้งหมด");
            }}
            className="text-[11px] text-navy/70 hover:text-navy underline underline-offset-2 transition-colors cursor-pointer px-1 py-1"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Right Side: Data source badge and refresh */}
      <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
        <span className="text-[11px] text-slate font-medium">
          พบ <strong className="text-navy font-semibold">{totalFilteredRows}</strong> รายการ
        </span>

        <div className="h-4 w-px bg-border-light hidden sm:block" />

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-light/80 border border-border-light text-[11px] text-slate"
          title={dataSource}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isFallback ? "bg-warning" : "bg-success animate-pulse"
            }`}
          />
          <span className="truncate max-w-[150px]">
            {isFallback ? "ข้อมูลออฟไลน์" : "ข้อมูลจริง Google Sheets"}
          </span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-border hover:bg-cream-light text-slate hover:text-navy transition-colors disabled:opacity-50 cursor-pointer"
            title="รีเฟรชข้อมูลจาก Google Sheets"
            aria-label="รีเฟรชข้อมูล"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-navy" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
