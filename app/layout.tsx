import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Community Data Analytics Dashboard",
  description:
    "ระบบวิเคราะห์ข้อมูลชุมชน - แดชบอร์ดสำหรับการวิเคราะห์ข้อมูลประชากร ครัวเรือน และโครงการพัฒนาชุมชน",
  keywords: ["community", "analytics", "dashboard", "data", "ข้อมูลชุมชน"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
