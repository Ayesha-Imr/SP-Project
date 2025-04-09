import { NextResponse } from "next/server"
import { loadWeatherData } from "@/lib/data-loader"

export async function GET() {
  try {
    const data = await loadWeatherData()
    console.log("API returned data count:", data?.length || 0)
    return NextResponse.json({ data, count: data.length })
  } catch (error) {
    console.error("API error:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: "Failed to load weather data", message: errorMessage }, { status: 500 })
  }
}
