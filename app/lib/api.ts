import {
  RawCommunityRecord,
  CommunityRecord,
  SummaryStats,
  YearlyTrendItem,
  DistrictPatientItem,
  ShareItem,
} from "./types";
import { realFallbackData } from "./fallbackData";

export const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzDWQTQH0Ysojlk3KP91uBELol_E_mS8M6p6ShraeUGi_AbgVQjFESz9diBAKDXt1UF/exec";

/**
 * Safely parse numeric strings from Google Sheets (handling commas, whitespace, nulls)
 */
export function parseNumber(val: unknown): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/,/g, "").trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Convert raw API response rows into clean typed CommunityRecord array
 */
export function transformRawRecords(rawItems: RawCommunityRecord[]): CommunityRecord[] {
  return rawItems.map((item, index) => {
    const yearStr = String(item["ปี"] || "").trim();
    const districtStr = String(item["อำเภอ"] || "").trim();
    const villages = parseNumber(item["หมู่บ้าน/ชุมชน"]);
    const patients = parseNumber(item["ผู้ป่วยเข้ารับบำบัด"]);
    const avg = villages > 0 ? Number((patients / villages).toFixed(1)) : 0;

    return {
      id: `${yearStr}-${districtStr}-${index}`,
      year: yearStr,
      yearNumber: parseInt(yearStr, 10) || 0,
      district: districtStr,
      villages,
      patients,
      avgPatientsPerVillage: avg,
    };
  });
}

/**
 * Fetch community data with resilient dual-strategy:
 * 1. Calls internal Next.js API route (/api/community-data)
 * 2. Falls back to direct Google Apps Script Web App URL
 * 3. Falls back to verified offline dataset if network completely unavailable
 */
export async function fetchCommunityData(): Promise<{
  data: CommunityRecord[];
  isFallback: boolean;
  source: string;
}> {
  // Strategy 1: Call internal Next.js route
  try {
    const res = await fetch("/api/community-data", {
      cache: "no-store",
    });
    if (res.ok) {
      const json: RawCommunityRecord[] = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        return {
          data: transformRawRecords(json),
          isFallback: false,
          source: "Google Apps Script API (via proxy)",
        };
      }
    }
  } catch (err) {
    console.warn("Internal API route fetch failed, attempting direct fetch...", err);
  }

  // Strategy 2: Call Google Apps Script directly
  try {
    const directRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (directRes.ok) {
      const json: RawCommunityRecord[] = await directRes.json();
      if (Array.isArray(json) && json.length > 0) {
        return {
          data: transformRawRecords(json),
          isFallback: false,
          source: "Google Apps Script API (direct)",
        };
      }
    }
  } catch (err) {
    console.warn("Direct fetch from Google Apps Script failed, using verified fallback...", err);
  }

  // Strategy 3: Real fallback data
  return {
    data: transformRawRecords(realFallbackData),
    isFallback: true,
    source: "Verified Sisaket Dataset (offline cache)",
  };
}

/**
 * Extract unique sorted years from dataset (descending)
 */
export function extractUniqueYears(data: CommunityRecord[]): string[] {
  const set = new Set<string>();
  data.forEach((d) => {
    if (d.year) set.add(d.year);
  });
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}

/**
 * Extract unique sorted districts from dataset (Thai alphabetical)
 */
export function extractUniqueDistricts(data: CommunityRecord[]): string[] {
  const set = new Set<string>();
  data.forEach((d) => {
    if (d.district) set.add(d.district);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * Calculate Summary Cards metrics with accurate logic and avoid village duplication misconceptions
 */
export function computeSummaryStats(
  allData: CommunityRecord[],
  filteredData: CommunityRecord[],
  selectedYear: string,
  selectedDistrict: string
): SummaryStats {
  const totalPatients = filteredData.reduce((sum, item) => sum + item.patients, 0);
  const totalVillages = filteredData.reduce((sum, item) => sum + item.villages, 0);

  const uniqueDistrictsInFilter = new Set(filteredData.map((d) => d.district)).size;
  const uniqueYearsInFilter = new Set(filteredData.map((d) => d.year)).size;

  let patientsChange: number | null = null;
  let villagesChange: number | null = null;

  // If a specific year is selected, calculate YoY change compared to previous year
  if (selectedYear !== "ทั้งหมด") {
    const curYearNum = parseInt(selectedYear, 10);
    const prevYearStr = String(curYearNum - 1);

    const prevYearData = allData.filter(
      (d) =>
        d.year === prevYearStr &&
        (selectedDistrict === "ทั้งหมด" || d.district === selectedDistrict)
    );

    if (prevYearData.length > 0) {
      const prevPatients = prevYearData.reduce((sum, d) => sum + d.patients, 0);
      const prevVillages = prevYearData.reduce((sum, d) => sum + d.villages, 0);

      if (prevPatients > 0) {
        patientsChange = Number(
          (((totalPatients - prevPatients) / prevPatients) * 100).toFixed(1)
        );
      }
      if (prevVillages > 0) {
        villagesChange = Number(
          (((totalVillages - prevVillages) / prevVillages) * 100).toFixed(1)
        );
      }
    }
  }

  let villageNote = "";
  if (selectedYear === "ทั้งหมด") {
    villageNote = `รวมสะสมตามรอบปีที่มีข้อมูล (เฉลี่ย ${Math.round(
      totalVillages / Math.max(1, uniqueYearsInFilter)
    )} แห่ง/ปี)`;
  } else {
    villageNote = `หมู่บ้านเป้าหมายประจำปี พ.ศ. ${selectedYear}`;
  }

  return {
    totalVillages,
    totalPatients,
    totalDistricts: uniqueDistrictsInFilter,
    totalYears: uniqueYearsInFilter,
    villagesChange,
    patientsChange,
    villageNote,
  };
}

/**
 * Calculate yearly trend for patients and villages across all 4 years
 */
export function computeYearlyTrend(
  allData: CommunityRecord[],
  selectedDistrict: string
): YearlyTrendItem[] {
  const years = extractUniqueYears(allData).reverse(); // chronological order 2565 -> 2568

  return years.map((yr) => {
    const matches = allData.filter(
      (d) =>
        d.year === yr &&
        (selectedDistrict === "ทั้งหมด" || d.district === selectedDistrict)
    );
    const patients = matches.reduce((sum, d) => sum + d.patients, 0);
    const villages = matches.reduce((sum, d) => sum + d.villages, 0);

    return {
      year: yr,
      patients,
      villages,
      districtsCount: matches.length,
    };
  });
}

/**
 * Calculate patient count grouped by district (sorted descending)
 */
export function computeDistrictPatients(filteredData: CommunityRecord[]): DistrictPatientItem[] {
  const map = new Map<string, { patients: number; villages: number }>();

  filteredData.forEach((item) => {
    const existing = map.get(item.district) || { patients: 0, villages: 0 };
    map.set(item.district, {
      patients: existing.patients + item.patients,
      villages: existing.villages + item.villages,
    });
  });

  const result: DistrictPatientItem[] = [];
  map.forEach((value, district) => {
    result.push({
      district,
      patients: value.patients,
      villages: value.villages,
    });
  });

  // Sort descending by patients
  return result.sort((a, b) => b.patients - a.patients);
}

/**
 * Calculate proportional share data for donut/pie chart
 */
const MODERN_BRITISH_PALETTE = [
  "#142B40", // Deep Navy
  "#263F38", // British Forest Green
  "#687783", // Slate
  "#B7A17A", // Muted Gold
  "#8FA3B0", // Soft Slate Blue
  "#3D5A50", // Moss Forest
  "#9A8762", // Antique Gold
  "#4A5B66", // Charcoal Slate
];

export function computeShareData(
  filteredData: CommunityRecord[],
  selectedDistrict: string
): ShareItem[] {
  // If a single district is selected, show its yearly proportion
  if (selectedDistrict !== "ทั้งหมด") {
    const total = filteredData.reduce((sum, d) => sum + d.patients, 0);
    if (total === 0) return [];

    return filteredData.map((d, idx) => ({
      name: `พ.ศ. ${d.year}`,
      value: total > 0 ? Number(((d.patients / total) * 100).toFixed(1)) : 0,
      count: d.patients,
      color: MODERN_BRITISH_PALETTE[idx % MODERN_BRITISH_PALETTE.length],
    }));
  }

  // All districts: show top 5 districts + others
  const districtList = computeDistrictPatients(filteredData);
  const grandTotal = districtList.reduce((sum, d) => sum + d.patients, 0);

  if (grandTotal === 0) return [];

  const topItems = districtList.slice(0, 5);
  const remainingItems = districtList.slice(5);

  const result: ShareItem[] = topItems.map((item, idx) => ({
    name: item.district,
    value: Number(((item.patients / grandTotal) * 100).toFixed(1)),
    count: item.patients,
    color: MODERN_BRITISH_PALETTE[idx % MODERN_BRITISH_PALETTE.length],
  }));

  if (remainingItems.length > 0) {
    const othersCount = remainingItems.reduce((sum, d) => sum + d.patients, 0);
    result.push({
      name: "อำเภออื่นๆ",
      value: Number(((othersCount / grandTotal) * 100).toFixed(1)),
      count: othersCount,
      color: MODERN_BRITISH_PALETTE[5],
    });
  }

  return result;
}
