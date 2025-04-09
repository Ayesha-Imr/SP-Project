"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

type MetricType = 'temperature' | 'precipitation' | 'cloud_cover' | 'pressure';

interface WeatherPredictionChartProps {
  metric: MetricType
}

export function WeatherPredictionChart({ metric }: WeatherPredictionChartProps) {
  // Sample data for different metrics
  const metricData = {
    temperature: [
      { day: "Mon", actual: 18, predicted: 17.5, lower: 16, upper: 19 },
      { day: "Tue", actual: 16, predicted: 16.2, lower: 15, upper: 17.5 },
      { day: "Wed", actual: 17, predicted: 16.5, lower: 15, upper: 18 },
      { day: "Thu", actual: null, predicted: 15.8, lower: 14, upper: 17.5 },
      { day: "Fri", actual: null, predicted: 14.5, lower: 13, upper: 16 },
      { day: "Sat", actual: null, predicted: 16.2, lower: 14.5, upper: 18 },
      { day: "Sun", actual: null, predicted: 17.8, lower: 16, upper: 19.5 },
    ],
    precipitation: [
      { day: "Mon", actual: 2.5, predicted: 2.2, lower: 1.5, upper: 3.0 },
      { day: "Tue", actual: 5.2, predicted: 4.8, lower: 3.5, upper: 6.0 },
      { day: "Wed", actual: 3.1, predicted: 3.5, lower: 2.0, upper: 5.0 },
      { day: "Thu", actual: null, predicted: 1.2, lower: 0.5, upper: 2.0 },
      { day: "Fri", actual: null, predicted: 0.5, lower: 0.0, upper: 1.5 },
      { day: "Sat", actual: null, predicted: 2.8, lower: 1.5, upper: 4.0 },
      { day: "Sun", actual: null, predicted: 4.5, lower: 3.0, upper: 6.0 },
    ],
    cloud_cover: [
      { day: "Mon", actual: 65, predicted: 60, lower: 50, upper: 70 },
      { day: "Tue", actual: 80, predicted: 75, lower: 65, upper: 85 },
      { day: "Wed", actual: 70, predicted: 65, lower: 55, upper: 75 },
      { day: "Thu", actual: null, predicted: 55, lower: 45, upper: 65 },
      { day: "Fri", actual: null, predicted: 40, lower: 30, upper: 50 },
      { day: "Sat", actual: null, predicted: 60, lower: 50, upper: 70 },
      { day: "Sun", actual: null, predicted: 75, lower: 65, upper: 85 },
    ],
    pressure: [
      { day: "Mon", actual: 1012, predicted: 1010, lower: 1008, upper: 1012 },
      { day: "Tue", actual: 1008, predicted: 1006, lower: 1004, upper: 1008 },
      { day: "Wed", actual: 1010, predicted: 1012, lower: 1010, upper: 1014 },
      { day: "Thu", actual: null, predicted: 1014, lower: 1012, upper: 1016 },
      { day: "Fri", actual: null, predicted: 1016, lower: 1014, upper: 1018 },
      { day: "Sat", actual: null, predicted: 1012, lower: 1010, upper: 1014 },
      { day: "Sun", actual: null, predicted: 1008, lower: 1006, upper: 1010 },
    ],
  }
  const units: Record<MetricType, string> = {
    temperature: "°C",
    precipitation: "mm",
    cloud_cover: "%",
    pressure: "hPa",
  }

  const unit = units[metric] || ""

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={metricData[metric]}>
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}${unit}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length >= 4) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Predicted</span>
                        <span className="font-bold text-primary">
                          {payload[0]?.value || "N/A"}
                          {unit}
                        </span>
                      </div>
                      {payload[1]?.value !== null && (
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Actual</span>
                          <span className="font-bold text-primary">
                            {payload[1]?.value || "N/A"}
                            {unit}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Lower Bound</span>
                        <span className="font-bold text-primary">
                          {payload[2]?.value || "N/A"}
                          {unit}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Upper Bound</span>
                        <span className="font-bold text-primary">
                          {payload[3]?.value || "N/A"}
                          {unit}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="predicted" strokeWidth={2} stroke="#2563eb" />
        <Line type="monotone" dataKey="actual" strokeWidth={2} stroke="#16a34a" />
        <Line type="monotone" dataKey="lower" strokeWidth={1} stroke="#64748b" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="upper" strokeWidth={1} stroke="#64748b" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  )
}
