// Types for Community Data Analytics Dashboard

export interface RawCommunityRecord {
  "ปี": string;
  "อำเภอ": string;
  "หมู่บ้าน/ชุมชน": string;
  "ผู้ป่วยเข้ารับบำบัด": string;
}

export interface CommunityRecord {
  id: string;
  year: string;
  yearNumber: number;
  district: string;
  villages: number;
  patients: number;
  avgPatientsPerVillage: number;
}

export interface SummaryStats {
  totalVillages: number;
  totalPatients: number;
  totalDistricts: number;
  totalYears: number;
  villagesChange: number | null;
  patientsChange: number | null;
  villageNote: string;
}

export interface YearlyTrendItem {
  year: string;
  patients: number;
  villages: number;
  districtsCount: number;
}

export interface DistrictPatientItem {
  district: string;
  patients: number;
  villages: number;
}

export interface ShareItem {
  name: string;
  value: number;
  count: number;
  color: string;
}
