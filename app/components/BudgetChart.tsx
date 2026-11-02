"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ShareItem } from "@/app/lib/types";

interface BudgetChartProps {
  data: ShareItem[];
  selectedDistrict: string;
  selectedYear: string;
  isLoading?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { color: string; count: number };
  }>;
}) => {
  if (!active || !payload || !payload[0]) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 min-w-[150px]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-sm font-medium text-navy">{item.name}</span>
      </div>
      <p className="text-base font-heading font-bold text-navy">
        {item.value}%{" "}
        <span className="text-xs font-normal text-slate font-sans">
          ({item.payload.count.toLocaleString()} คน)
        </span>
      </p>
    </div>
  );
};

export default function BudgetChart({
  data,
  selectedDistrict,
  selectedYear,
  isLoading = false,
}: BudgetChartProps) {
  if (isLoading) {
    return (
      <div className="dashboard-card p-5 lg:p-6 animate-pulse">
        <div className="h-6 w-40 bg-cream-light rounded mb-2" />
        <div className="h-4 w-52 bg-cream-light rounded mb-6" />
        <div className="h-[200px] bg-cream-light/50 rounded" />
      </div>
    );
  }

  const subtitle =
    selectedDistrict === "ทั้งหมด"
      ? selectedYear === "ทั้งหมด"
        ? "สัดส่วนอำเภอที่มีผู้ป่วยสูงสุด (รวมทุกปี)"
        : `สัดส่วนรายอำเภอ ประจำปี ${selectedYear}`
      : `สัดส่วนผู้ป่วยรายปี อ.${selectedDistrict}`;

  if (!data || data.length === 0) {
    return (
      <div className="dashboard-card p-5 lg:p-6 flex flex-col items-center justify-center min-h-[280px] text-center">
        <p className="text-slate text-sm">ไม่มีข้อมูลสำหรับสัดส่วนตามเงื่อนไขที่เลือก</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-5 lg:p-6 animate-fade-in stagger-6">
      <div className="mb-4">
        <h3 className="font-heading text-navy text-base font-semibold">
          สัดส่วนผู้ป่วยเข้ารับบำบัด
        </h3>
        <p className="text-slate text-xs mt-0.5">{subtitle}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="chart-container h-[190px] w-[190px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2.5}
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="flex-1 text-xs text-slate truncate"
                title={`${item.name} (${item.count.toLocaleString()} คน)`}
              >
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-cream-light rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, item.value)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-navy w-9 text-right font-mono">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
