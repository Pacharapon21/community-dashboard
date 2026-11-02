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
import { CommunityRecord } from "@/app/lib/types";

interface ActivityChartProps {
  filteredData: CommunityRecord[];
  allData: CommunityRecord[];
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
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 min-w-[150px]">
      <p className="text-navy font-semibold text-sm mb-1.5 border-b border-border-light pb-1">
        {label}
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
            <span className="text-[10px] text-slate font-normal">แห่ง</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ActivityChart({
  filteredData,
  allData,
  selectedDistrict,
  selectedYear,
  isLoading = false,
}: ActivityChartProps) {
  if (isLoading) {
    return (
      <div className="dashboard-card p-5 lg:p-6 animate-pulse">
        <div className="h-6 w-48 bg-cream-light rounded mb-2" />
        <div className="h-4 w-60 bg-cream-light rounded mb-6" />
        <div className="h-[280px] bg-cream-light/50 rounded" />
      </div>
    );
  }

  // If a single district is selected, show village trend over the 4 years
  let chartData: Array<{ name: string; villages: number }> = [];
  let subtitle = "";

  if (selectedDistrict !== "ทั้งหมด") {
    const years = ["2565", "2566", "2567", "2568"];
    chartData = years.map((yr) => {
      const match = allData.find(
        (d) => d.district === selectedDistrict && d.year === yr
      );
      return {
        name: `พ.ศ. ${yr}`,
        villages: match ? match.villages : 0,
      };
    });
    subtitle = `จำนวนหมู่บ้านเป้าหมายรายปี อ.${selectedDistrict}`;
  } else {
    // When all districts selected, show top 10 districts by village count
    const districtMap = new Map<string, number>();
    filteredData.forEach((d) => {
      const cur = districtMap.get(d.district) || 0;
      districtMap.set(d.district, cur + d.villages);
    });

    const sorted = Array.from(districtMap.entries())
      .map(([name, villages]) => ({ name, villages }))
      .sort((a, b) => b.villages - a.villages)
      .slice(0, 10);

    chartData = sorted;
    subtitle =
      selectedYear === "ทั้งหมด"
        ? "10 อำเภอที่มีจำนวนหมู่บ้านเป้าหมายสูงสุด (รวมทุกปี)"
        : `10 อำเภอที่มีจำนวนหมู่บ้านเป้าหมายสูงสุด (ปี ${selectedYear})`;
  }

  return (
    <div className="dashboard-card p-5 lg:p-6 animate-fade-in stagger-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="font-heading text-navy text-base font-semibold">
            เปรียบเทียบจำนวนหมู่บ้าน/ชุมชน
          </h3>
          <p className="text-slate text-xs mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate">
            <span className="w-3 h-3 rounded-sm bg-forest" />
            หมู่บ้าน/ชุมชน (แห่ง)
          </span>
        </div>
      </div>
      <div className="chart-container h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E0DAD0"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={{ stroke: "#E0DAD0" }}
              interval={0}
              angle={selectedDistrict === "ทั้งหมด" ? -30 : 0}
              textAnchor={selectedDistrict === "ทั้งหมด" ? "end" : "middle"}
              height={selectedDistrict === "ทั้งหมด" ? 45 : 25}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#687783" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="villages"
              name="หมู่บ้าน/ชุมชน"
              fill="#263F38"
              radius={[4, 4, 0, 0]}
              barSize={selectedDistrict === "ทั้งหมด" ? 18 : 32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
