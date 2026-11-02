"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DistrictPatientItem } from "@/app/lib/types";

interface DistrictChartProps {
  data: DistrictPatientItem[];
  selectedDistrict: string;
  selectedYear: string;
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 min-w-[170px]">
      <p className="text-navy font-semibold text-sm mb-1.5 border-b border-border-light pb-1">
        อำเภอ{label}
      </p>
      {payload.map((entry, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 text-xs py-0.5"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate">{entry.name}</span>
          </span>
          <span className="font-semibold text-navy">
            {entry.value.toLocaleString()}{" "}
            <span className="text-[10px] text-slate font-normal">คน</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DistrictChart({
  data,
  selectedDistrict,
  selectedYear,
  isLoading = false,
}: DistrictChartProps) {
  if (isLoading) {
    return (
      <div className="dashboard-card p-5 lg:p-6 animate-pulse">
        <div className="h-6 w-48 bg-cream-light rounded mb-2" />
        <div className="h-4 w-60 bg-cream-light rounded mb-6" />
        <div className="h-[320px] bg-cream-light/50 rounded" />
      </div>
    );
  }

  // Display top 8 districts or all if filtered
  const displayData = data.slice(0, 8);

  const subtitle =
    selectedDistrict === "ทั้งหมด"
      ? selectedYear === "ทั้งหมด"
        ? "อันดับอำเภอที่มีผู้ป่วยเข้ารับบำบัดสูงสุด (รวมทุกปี)"
        : `อันดับอำเภอที่มีผู้ป่วยเข้ารับบำบัดสูงสุด (ปี ${selectedYear})`
      : `ข้อมูลผู้ป่วยเข้ารับบำบัด อ.${selectedDistrict}`;

  return (
    <div className="dashboard-card p-5 lg:p-6 animate-fade-in stagger-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="font-heading text-navy text-base font-semibold">
            จำนวนผู้ป่วยรายอำเภอ
          </h3>
          <p className="text-slate text-xs mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate">
            <span className="w-3 h-3 rounded-sm bg-navy" />
            ผู้ป่วย (คน)
          </span>
        </div>
      </div>
      <div className="chart-container h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 5, right: 25, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0DAD0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={{ stroke: "#E0DAD0" }}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <YAxis
              dataKey="district"
              type="category"
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="patients"
              name="ผู้ป่วยเข้ารับบำบัด"
              fill="#142B40"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
