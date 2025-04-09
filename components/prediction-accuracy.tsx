"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  {
    metric: "Temperature",
    accuracy: 92,
  },
  {
    metric: "Precipitation",
    accuracy: 87,
  },
  {
    metric: "Cloud Cover",
    accuracy: 85,
  },
  {
    metric: "Pressure",
    accuracy: 94,
  },
  {
    metric: "Sunshine",
    accuracy: 83,
  },
]

export function PredictionAccuracy() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="metric" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[70, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Accuracy</span>
                      <span className="font-bold text-primary">{payload[0].value}%</span>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="accuracy" strokeWidth={2} stroke="#2563eb" />
      </LineChart>
    </ResponsiveContainer>
  )
}
