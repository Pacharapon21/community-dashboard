import { NextResponse } from "next/server";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzDWQTQH0Ysojlk3KP91uBELol_E_mS8M6p6ShraeUGi_AbgVQjFESz9diBAKDXt1UF/exec";

export async function GET() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch Google Sheets data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from Google Sheets",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
