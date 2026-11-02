"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { YearlyTrendItem } from "@/app/lib/types";

interface PopulationChartProps {
  data: YearlyTrendItem[];
  selectedDistrict: string;
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
      <p className="text-navy font-semibold text-sm mb-2 border-b border-border-light pb-1">
        พ.ศ. {label}
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
            <span className="text-[10px] text-slate font-normal">
              {entry.name.includes("ผู้ป่วย") ? "คน" : "แห่ง"}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PopulationChart({
  data,
  selectedDistrict,
  isLoading = false,
}: PopulationChartProps) {
  if (isLoading) {
    return (
      <div className="dashboard-card p-5 lg:p-6 animate-pulse">
        <div className="h-6 w-48 bg-cream-light rounded mb-2" />
        <div className="h-4 w-64 bg-cream-light rounded mb-6" />
        <div className="h-[280px] bg-cream-light/50 rounded" />
      </div>
    );
  }

  const subtitle =
    selectedDistrict === "ทั้งหมด"
      ? "ข้อมูลภาพรวมจังหวัดศรีสะเกษ พ.ศ. 2565 - 2568"
      : `แนวโน้มอำเภอ${selectedDistrict} พ.ศ. 2565 - 2568`;

  return (
    <div className="dashboard-card p-5 lg:p-6 animate-fade-in stagger-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="font-heading text-navy text-base font-semibold">
            แนวโน้มจำนวนผู้ป่วยรายปี
          </h3>
          <p className="text-slate text-xs mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate">
            <span className="w-3 h-0.5 rounded-full bg-navy" />
            ผู้ป่วยเข้ารับบำบัด (คน)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate">
            <span className="w-3 h-0.5 rounded-full bg-forest" />
            หมู่บ้าน/ชุมชน (แห่ง)
          </span>
        </div>
      </div>
      <div className="chart-container h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#142B40" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#142B40" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="villageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#263F38" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#263F38" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0DAD0"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={{ stroke: "#E0DAD0" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="patients"
              name="ผู้ป่วยเข้ารับบำบัด"
              stroke="#142B40"
              strokeWidth={2.5}
              fill="url(#patientGrad)"
              dot={{ r: 4, fill: "#142B40", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#142B40",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="villages"
              name="หมู่บ้าน/ชุมชน"
              stroke="#263F38"
              strokeWidth={2}
              fill="url(#villageGrad)"
              dot={{ r: 3.5, fill: "#263F38", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{
                r: 5,
                fill: "#263F38",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
