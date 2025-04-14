"use client"
import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/markov-chain"

export function PrecipitationChart() {
  const [data, setData] = useState<Array<{date: string, value: number}>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch("/api/weather-data")

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const result = await response.json()
        const weatherData: WeatherData[] = result.data

        if (weatherData.length > 0) {
          // Process the last 7 days of data
          const processedData = processPrecipitationData(weatherData)
          setData(processedData)
        } else {
          // Fall back to default values if no data
          setData(getDefaultData())
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load precipitation data")
        setData(getDefaultData()) // Use default data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process weather data to extract precipitation trends for the last 7 days
  function processPrecipitationData(weatherData: WeatherData[]) {
    // Sort by date to ensure chronological order
    const sortedData = [...weatherData].sort((a, b) => {
      // Create proper Date objects for comparison
      const dateA = parseDateSafely(a.date);
      const dateB = parseDateSafely(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    
    // Get the last 7 days of data or all if less than 7
    const recentData = sortedData.slice(-7)
    
    // Format the data for the chart
    return recentData.map((item) => {
      // Get day name from date
      const date = parseDateSafely(item.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: dayName,
        value: parseFloat(item.precipitation.toFixed(1)),
      }
    })
  }
  
  // Helper function to parse dates in different formats safely
  function parseDateSafely(dateStr: string): Date {
    // Try standard ISO format first (YYYY-MM-DD)
    let date = new Date(dateStr);
    
    // If invalid, try to parse compact format (YYYYMMDD)
    if (isNaN(date.getTime()) && /^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1; // Months are 0-indexed
      const day = parseInt(dateStr.substring(6, 8));
      date = new Date(year, month, day);
    }
    
    // If still invalid, use current date as fallback
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateStr);
      return new Date();
    }
    
    return date;
  }
  
  // Default data when API call fails or returns no data
  function getDefaultData() {
    return [
      { date: "Mon", value: 2.5 },
      { date: "Tue", value: 5.2 },
      { date: "Wed", value: 3.1 },
      { date: "Thu", value: 0.5 },
      { date: "Fri", value: 0 },
      { date: "Sat", value: 1.5 },
      { date: "Sun", value: 4.2 },
    ]
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading precipitation data...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}mm`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Precipitation</span>
                      <span className="font-bold text-primary">{payload[0].value}mm</span>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
