// Mock data for Community Data Analytics Dashboard

export const years = ["2567", "2566", "2565", "2564", "2563"];

export const districts = [
  "ทั้งหมด",
  "เมืองเชียงใหม่",
  "จอมทอง",
  "แม่แจ่ม",
  "เชียงดาว",
  "ดอยสะเก็ด",
  "แม่แตง",
  "แม่ริม",
  "สะเมิง",
  "ฝาง",
  "แม่อาย",
  "พร้าว",
  "สันป่าตอง",
  "สันกำแพง",
  "สันทราย",
  "หางดง",
  "ฮอด",
];

export interface SummaryCard {
  id: string;
  title: string;
  value: string;
  change: number;
  unit: string;
  icon: string;
}

export const summaryCards: SummaryCard[] = [
  {
    id: "population",
    title: "ประชากรทั้งหมด",
    value: "1,789,465",
    change: 2.4,
    unit: "คน",
    icon: "users",
  },
  {
    id: "households",
    title: "ครัวเรือนทั้งหมด",
    value: "682,310",
    change: 3.1,
    unit: "ครัวเรือน",
    icon: "home",
  },
  {
    id: "community-orgs",
    title: "องค์กรชุมชน",
    value: "4,528",
    change: -1.2,
    unit: "แห่ง",
    icon: "building",
  },
  {
    id: "projects",
    title: "โครงการพัฒนา",
    value: "1,247",
    change: 8.5,
    unit: "โครงการ",
    icon: "chart",
  },
];

export interface PopulationTrendData {
  year: string;
  population: number;
  households: number;
}

export const populationTrend: PopulationTrendData[] = [
  { year: "2563", population: 1720000, households: 640000 },
  { year: "2564", population: 1735000, households: 652000 },
  { year: "2565", population: 1755000, households: 663000 },
  { year: "2566", population: 1772000, households: 674000 },
  { year: "2567", population: 1789465, households: 682310 },
];

export interface DistrictComparisonData {
  district: string;
  population: number;
  households: number;
  organizations: number;
}

export const districtComparison: DistrictComparisonData[] = [
  { district: "เมืองเชียงใหม่", population: 285000, households: 112000, organizations: 820 },
  { district: "สันทราย", population: 145000, households: 58000, organizations: 380 },
  { district: "หางดง", population: 128000, households: 51000, organizations: 340 },
  { district: "สันกำแพง", population: 115000, households: 46000, organizations: 310 },
  { district: "แม่ริม", population: 108000, households: 43000, organizations: 290 },
  { district: "ดอยสะเก็ด", population: 98000, households: 39000, organizations: 260 },
  { district: "สันป่าตอง", population: 92000, households: 37000, organizations: 240 },
  { district: "ฝาง", population: 88000, households: 35000, organizations: 230 },
];

export interface BudgetAllocationData {
  name: string;
  value: number;
  color: string;
}

export const budgetAllocation: BudgetAllocationData[] = [
  { name: "โครงสร้างพื้นฐาน", value: 35, color: "#142B40" },
  { name: "การศึกษา", value: 22, color: "#263F38" },
  { name: "สาธารณสุข", value: 18, color: "#687783" },
  { name: "สิ่งแวดล้อม", value: 12, color: "#B7A17A" },
  { name: "เศรษฐกิจ", value: 8, color: "#8FA3B0" },
  { name: "อื่นๆ", value: 5, color: "#A09484" },
];

export interface MonthlyActivityData {
  month: string;
  projects: number;
  budget: number;
}

export const monthlyActivity: MonthlyActivityData[] = [
  { month: "ม.ค.", projects: 85, budget: 42 },
  { month: "ก.พ.", projects: 92, budget: 48 },
  { month: "มี.ค.", projects: 78, budget: 38 },
  { month: "เม.ย.", projects: 65, budget: 32 },
  { month: "พ.ค.", projects: 98, budget: 52 },
  { month: "มิ.ย.", projects: 112, budget: 58 },
  { month: "ก.ค.", projects: 105, budget: 55 },
  { month: "ส.ค.", projects: 120, budget: 62 },
  { month: "ก.ย.", projects: 115, budget: 60 },
  { month: "ต.ค.", projects: 108, budget: 56 },
  { month: "พ.ย.", projects: 95, budget: 50 },
  { month: "ธ.ค.", projects: 88, budget: 45 },
];

export interface TableRow {
  id: number;
  district: string;
  population: string;
  households: string;
  organizations: number;
  projects: number;
  budget: string;
  status: "ดำเนินการ" | "เสร็จสิ้น" | "รอดำเนินการ";
}

export const tableData: TableRow[] = [
  { id: 1, district: "เมืองเชียงใหม่", population: "285,000", households: "112,000", organizations: 820, projects: 245, budget: "125.8", status: "ดำเนินการ" },
  { id: 2, district: "สันทราย", population: "145,000", households: "58,000", organizations: 380, projects: 156, budget: "78.5", status: "เสร็จสิ้น" },
  { id: 3, district: "หางดง", population: "128,000", households: "51,000", organizations: 340, projects: 132, budget: "66.2", status: "ดำเนินการ" },
  { id: 4, district: "สันกำแพง", population: "115,000", households: "46,000", organizations: 310, projects: 118, budget: "58.9", status: "เสร็จสิ้น" },
  { id: 5, district: "แม่ริม", population: "108,000", households: "43,000", organizations: 290, projects: 105, budget: "52.4", status: "รอดำเนินการ" },
  { id: 6, district: "ดอยสะเก็ด", population: "98,000", households: "39,000", organizations: 260, projects: 96, budget: "48.1", status: "ดำเนินการ" },
  { id: 7, district: "สันป่าตอง", population: "92,000", households: "37,000", organizations: 240, projects: 88, budget: "44.0", status: "เสร็จสิ้น" },
  { id: 8, district: "ฝาง", population: "88,000", households: "35,000", organizations: 230, projects: 82, budget: "41.5", status: "รอดำเนินการ" },
  { id: 9, district: "แม่แตง", population: "85,000", households: "34,000", organizations: 220, projects: 78, budget: "39.2", status: "ดำเนินการ" },
  { id: 10, district: "เชียงดาว", population: "78,000", households: "31,000", organizations: 195, projects: 72, budget: "36.0", status: "เสร็จสิ้น" },
  { id: 11, district: "จอมทอง", population: "72,000", households: "28,000", organizations: 180, projects: 65, budget: "32.8", status: "รอดำเนินการ" },
  { id: 12, district: "พร้าว", population: "68,000", households: "27,000", organizations: 165, projects: 58, budget: "29.4", status: "ดำเนินการ" },
];
