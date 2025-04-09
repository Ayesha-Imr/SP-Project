"use client"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  {
    days: "1 Day",
    accuracy: 92,
  },
  {
    days: "2 Days",
    accuracy: 87,
  },
  {
    days: "3 Days",
    accuracy: 82,
  },
  {
    days: "4 Days",
    accuracy: 76,
  },
  {
    days: "5 Days",
    accuracy: 70,
  },
  {
    days: "6 Days",
    accuracy: 65,
  },
  {
    days: "7 Days",
    accuracy: 60,
  },
]

export function MarkovPredictionAccuracy() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="days" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Prediction Accuracy</span>
                      <span className="font-bold text-primary">{payload[0].value}%</span>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="accuracy" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
