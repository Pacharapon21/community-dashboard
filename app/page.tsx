"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import PopulationChart from "./components/PopulationChart";
import BudgetChart from "./components/BudgetChart";
import ActivityChart from "./components/ActivityChart";
import DistrictChart from "./components/DistrictChart";
import DataTable from "./components/DataTable";
import { CommunityRecord } from "./lib/types";
import {
  fetchCommunityData,
  extractUniqueYears,
  extractUniqueDistricts,
  computeSummaryStats,
  computeYearlyTrend,
  computeDistrictPatients,
  computeShareData,
} from "./lib/api";

export default function Home() {
  const [data, setData] = useState<CommunityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("Google Sheets API");
  const [isFallback, setIsFallback] = useState(false);

  // Filters
  const [selectedYear, setSelectedYear] = useState("ทั้งหมด");
  const [selectedDistrict, setSelectedDistrict] = useState("ทั้งหมด");

  // Load data function
  const loadData = useCallback(async (isRefreshAction = false) => {
    if (isRefreshAction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await fetchCommunityData();
      setData(result.data);
      setIsFallback(result.isFallback);
      setDataSource(result.source);
    } catch (err) {
      console.error("Error loading community data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "ไม่สามารถเชื่อมต่อข้อมูลจาก Google Sheets ได้"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived filter dropdown options from real data
  const availableYears = useMemo(() => {
    const yrs = extractUniqueYears(data);
    return ["ทั้งหมด", ...yrs];
  }, [data]);

  const availableDistricts = useMemo(() => {
    const dists = extractUniqueDistricts(data);
    return ["ทั้งหมด", ...dists];
  }, [data]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchYear =
        selectedYear === "ทั้งหมด" || item.year === selectedYear;
      const matchDistrict =
        selectedDistrict === "ทั้งหมด" || item.district === selectedDistrict;
      return matchYear && matchDistrict;
    });
  }, [data, selectedYear, selectedDistrict]);

  // Computed metrics for cards and charts
  const summaryStats = useMemo(() => {
    return computeSummaryStats(
      data,
      filteredData,
      selectedYear,
      selectedDistrict
    );
  }, [data, filteredData, selectedYear, selectedDistrict]);

  const yearlyTrend = useMemo(() => {
    return computeYearlyTrend(data, selectedDistrict);
  }, [data, selectedDistrict]);

  const districtPatients = useMemo(() => {
    return computeDistrictPatients(filteredData);
  }, [filteredData]);

  const shareData = useMemo(() => {
    return computeShareData(filteredData, selectedDistrict);
  }, [filteredData, selectedDistrict]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content Area - Full Width */}
      <main className="flex-1 w-full">
        <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
          {/* Error Notification Banner if any */}
          {error && (
            <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-between gap-3 text-sm text-danger animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="font-semibold">เกิดข้อผิดพลาด:</span>
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadData(true)}
                className="px-3 py-1 bg-danger text-white rounded-lg text-xs font-medium hover:bg-danger/90 transition-colors cursor-pointer"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          )}

          {/* Filters */}
          <FilterBar
            years={availableYears}
            districts={availableDistricts}
            selectedYear={selectedYear}
            selectedDistrict={selectedDistrict}
            onYearChange={setSelectedYear}
            onDistrictChange={setSelectedDistrict}
            onRefresh={() => loadData(true)}
            isRefreshing={isRefreshing}
            totalFilteredRows={filteredData.length}
            dataSource={dataSource}
            isFallback={isFallback}
          />

          {/* Summary Cards */}
          <SummaryCards
            stats={summaryStats}
            selectedYear={selectedYear}
            selectedDistrict={selectedDistrict}
            isLoading={isLoading}
          />

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
            <div className="lg:col-span-3">
              <PopulationChart
                data={yearlyTrend}
                selectedDistrict={selectedDistrict}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-2">
              <BudgetChart
                data={shareData}
                selectedDistrict={selectedDistrict}
                selectedYear={selectedYear}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <ActivityChart
              filteredData={filteredData}
              allData={data}
              selectedDistrict={selectedDistrict}
              selectedYear={selectedYear}
              isLoading={isLoading}
            />
            <DistrictChart
              data={districtPatients}
              selectedDistrict={selectedDistrict}
              selectedYear={selectedYear}
              isLoading={isLoading}
            />
          </div>

          {/* Data Table */}
          <DataTable data={filteredData} isLoading={isLoading} />

          {/* Footer */}
          <footer className="pt-4 pb-2 border-t border-border-light">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate/60">
              <p>
                © 2568 Community Data Analytics Dashboard — ข้อมูลจริงจาก Google
                Sheets (จังหวัดศรีสะเกษ)
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Modern British Architecture & Design</span>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
