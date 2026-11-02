"use client";

import React, { useState, useMemo } from "react";
import { CommunityRecord } from "@/app/lib/types";
import { SearchIcon } from "./Icons";

interface DataTableProps {
  data: CommunityRecord[];
  isLoading?: boolean;
}

function PriorityBadge({ patients }: { patients: number }) {
  if (patients >= 50) {
    return (
      <span className="status-badge bg-danger/10 text-danger border border-danger/20 font-medium">
        เฝ้าระวังเข้มข้น
      </span>
    );
  }
  if (patients >= 20) {
    return (
      <span className="status-badge bg-warning/15 text-gold-dark border border-warning/30 font-medium">
        เฝ้าระวังปานกลาง
      </span>
    );
  }
  return (
    <span className="status-badge bg-success/10 text-success border border-success/20 font-medium">
      เฝ้าระวังทั่วไป
    </span>
  );
}

export default function DataTable({ data, isLoading = false }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof CommunityRecord>("patients");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter by search term
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.trim().toLowerCase();
    return data.filter(
      (item) =>
        item.district.toLowerCase().includes(term) ||
        item.year.includes(term)
    );
  }, [data, searchTerm]);

  // Sort filtered records
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal, "th")
          : bVal.localeCompare(aVal, "th");
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: keyof CommunityRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  // Export filtered data as CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = [
      "ลำดับ",
      "ปี พ.ศ.",
      "อำเภอ",
      "หมู่บ้าน/ชุมชน (แห่ง)",
      "ผู้ป่วยเข้ารับบำบัด (คน)",
      "เฉลี่ยต่อหมู่บ้าน (คน/แห่ง)",
    ];
    const rows = sorted.map((row, idx) => [
      idx + 1,
      row.year,
      `"${row.district}"`,
      row.villages,
      row.patients,
      row.avgPatientsPerVillage,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `community_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sums for summary row
  const totalFilteredPatients = filtered.reduce((s, r) => s + r.patients, 0);
  const totalFilteredVillages = filtered.reduce((s, r) => s + r.villages, 0);

  if (isLoading) {
    return (
      <div className="dashboard-card p-5 lg:p-6 animate-pulse">
        <div className="h-6 w-48 bg-cream-light rounded mb-4" />
        <div className="h-64 bg-cream-light/40 rounded" />
      </div>
    );
  }

  return (
    <div className="dashboard-card animate-fade-in stagger-6 overflow-hidden">
      <div className="p-5 lg:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-navy text-base font-semibold">
              ตารางข้อมูลจริงจาก Google Sheets
            </h3>
            <p className="text-slate text-xs mt-0.5">
              แสดงข้อมูลสถิติผู้ป่วยบำบัดและหมู่บ้าน/ชุมชน แยกรายอำเภอ
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-cream-light/60 rounded-lg px-2.5 py-1.5 border border-border focus-within:border-navy focus-within:bg-white transition-all">
              <SearchIcon size={14} className="text-slate flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ค้นหาอำเภอ..."
                className="bg-transparent text-xs text-navy placeholder:text-slate/60 outline-none w-32 sm:w-36"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-slate/50 hover:text-navy text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs text-navy font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-cream-light hover:border-navy/40 transition-colors cursor-pointer"
              title="ส่งออกข้อมูลเป็น CSV รองรับ Excel ภาษาไทย"
            >
              <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>ส่งออก CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16 text-center">ลำดับ</th>
              <th
                onClick={() => handleSort("year")}
                className="cursor-pointer select-none hover:text-navy"
              >
                <div className="flex items-center gap-1">
                  <span>ปี พ.ศ.</span>
                  {sortField === "year" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("district")}
                className="cursor-pointer select-none hover:text-navy"
              >
                <div className="flex items-center gap-1">
                  <span>อำเภอ</span>
                  {sortField === "district" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("villages")}
                className="cursor-pointer select-none hover:text-navy text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>หมู่บ้าน/ชุมชน (แห่ง)</span>
                  {sortField === "villages" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("patients")}
                className="cursor-pointer select-none hover:text-navy text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ผู้ป่วยเข้ารับบำบัด (คน)</span>
                  {sortField === "patients" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("avgPatientsPerVillage")}
                className="cursor-pointer select-none hover:text-navy text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>เฉลี่ย (คน/แห่ง)</span>
                  {sortField === "avgPatientsPerVillage" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th className="text-center">กลุ่มเฝ้าระวัง</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate text-xs">
                  ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
                </td>
              </tr>
            ) : (
              currentRecords.map((row, idx) => {
                const serialNumber = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={row.id}>
                    <td className="text-center font-mono text-slate text-xs">
                      {serialNumber}
                    </td>
                    <td className="font-mono text-xs text-slate font-medium">
                      {row.year}
                    </td>
                    <td className="font-medium text-navy text-sm">
                      {row.district}
                    </td>
                    <td className="font-mono text-right text-slate-dark">
                      {row.villages.toLocaleString()}
                    </td>
                    <td className="font-mono text-right font-semibold text-navy">
                      {row.patients.toLocaleString()}
                    </td>
                    <td className="font-mono text-right text-slate text-xs">
                      {row.avgPatientsPerVillage.toFixed(1)}
                    </td>
                    <td className="text-center">
                      <PriorityBadge patients={row.patients} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="bg-cream-light/40 font-semibold border-t-2 border-border text-navy text-xs">
                <td colSpan={3} className="text-right pr-4 font-heading">
                  รวมตามตัวกรอง ({filtered.length} แถว):
                </td>
                <td className="font-mono text-right">
                  {totalFilteredVillages.toLocaleString()}
                </td>
                <td className="font-mono text-right text-navy font-bold">
                  {totalFilteredPatients.toLocaleString()}
                </td>
                <td className="font-mono text-right text-slate font-normal">
                  {totalFilteredVillages > 0
                    ? (totalFilteredPatients / totalFilteredVillages).toFixed(1)
                    : "0.0"}
                </td>
                <td className="text-center text-[11px] text-slate font-normal">
                  —
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate">
        <div>
          แสดง{" "}
          <strong className="text-navy font-medium">
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
          </strong>{" "}
          ถึง{" "}
          <strong className="text-navy font-medium">
            {Math.min(currentPage * pageSize, filtered.length)}
          </strong>{" "}
          จากทั้งหมด{" "}
          <strong className="text-navy font-medium">{filtered.length}</strong> รายการ
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-border hover:bg-cream-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ย้อนกลับ
            </button>
            <span className="px-2 font-mono text-navy font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-border hover:bg-cream-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
