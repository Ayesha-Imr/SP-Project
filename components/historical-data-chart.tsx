"use client"
import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/markov-chain"

interface HistoricalDataChartProps {
  metric: 'temperature' | 'precipitation' | 'cloud_cover' | 'pressure' | 'sunshine'
}

export function HistoricalDataChart({ metric }: HistoricalDataChartProps) {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  // Always use sample data
  useEffect(() => {
    // Short delay to simulate loading
    const timer = setTimeout(() => {
      setChartData(getSampleData(metric))
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [metric])

  // Sample data as fallback
  const getSampleData = (metricName: 'temperature' | 'precipitation' | 'cloud_cover' | 'pressure' | 'sunshine') => {
    // Sample data for different metrics
    const metricData = {
      temperature: [
        { month: "Jan", value: 5.2 },
        { month: "Feb", value: 5.8 },
        { month: "Mar", value: 8.3 },
        { month: "Apr", value: 11.2 },
        { month: "May", value: 14.7 },
        { month: "Jun", value: 17.9 },
        { month: "Jul", value: 19.6 },
        { month: "Aug", value: 19.2 },
        { month: "Sep", value: 16.5 },
        { month: "Oct", value: 12.8 },
        { month: "Nov", value: 8.7 },
        { month: "Dec", value: 6.1 },
      ],
      precipitation: [
        { month: "Jan", value: 55.2 },
        { month: "Feb", value: 40.5 },
        { month: "Mar", value: 41.6 },
        { month: "Apr", value: 43.7 },
        { month: "May", value: 49.3 },
        { month: "Jun", value: 45.1 },
        { month: "Jul", value: 44.5 },
        { month: "Aug", value: 49.5 },
        { month: "Sep", value: 49.1 },
        { month: "Oct", value: 68.5 },
        { month: "Nov", value: 59.0 },
        { month: "Dec", value: 55.2 },
      ],
      cloud_cover: [
        { month: "Jan", value: 72 },
        { month: "Feb", value: 69 },
        { month: "Mar", value: 65 },
        { month: "Apr", value: 60 },
        { month: "May", value: 58 },
        { month: "Jun", value: 56 },
        { month: "Jul", value: 55 },
        { month: "Aug", value: 56 },
        { month: "Sep", value: 59 },
        { month: "Oct", value: 65 },
        { month: "Nov", value: 71 },
        { month: "Dec", value: 74 },
      ],
      pressure: [
        { month: "Jan", value: 1016 },
        { month: "Feb", value: 1015 },
        { month: "Mar", value: 1014 },
        { month: "Apr", value: 1013 },
        { month: "May", value: 1015 },
        { month: "Jun", value: 1014 },
        { month: "Jul", value: 1013 },
        { month: "Aug", value: 1014 },
        { month: "Sep", value: 1015 },
        { month: "Oct", value: 1014 },
        { month: "Nov", value: 1013 },
        { month: "Dec", value: 1015 },
      ],
      sunshine: [
        { month: "Jan", value: 61 },
        { month: "Feb", value: 77 },
        { month: "Mar", value: 114 },
        { month: "Apr", value: 157 },
        { month: "May", value: 193 },
        { month: "Jun", value: 195 },
        { month: "Jul", value: 190 },
        { month: "Aug", value: 184 },
        { month: "Sep", value: 137 },
        { month: "Oct", value: 108 },
        { month: "Nov", value: 70 },
        { month: "Dec", value: 52 },
      ],
    }

    return metricData[metricName] || metricData.temperature
  }

  const units = {
    temperature: "°C",
    precipitation: "mm",
    cloud_cover: "%",
    pressure: "hPa",
    sunshine: "hours",
  }

  const unit = units[metric] || ""

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}${unit}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{metric}</span>
                      <span className="font-bold text-primary">
                        {payload[0].value}
                        {unit}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="value" strokeWidth={2} stroke="#2563eb" />
      </LineChart>
    </ResponsiveContainer>
  )
}