"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  {
    date: "Mon",
    max: 18,
    min: 12,
    avg: 15,
  },
  {
    date: "Tue",
    max: 16,
    min: 11,
    avg: 13.5,
  },
  {
    date: "Wed",
    max: 17,
    min: 10,
    avg: 13.5,
  },
  {
    date: "Thu",
    max: 15,
    min: 9,
    avg: 12,
  },
  {
    date: "Fri",
    max: 14,
    min: 8,
    avg: 11,
  },
  {
    date: "Sat",
    max: 16,
    min: 10,
    avg: 13,
  },
  {
    date: "Sun",
    max: 18,
    min: 12,
    avg: 15,
  },
]

export function TemperatureChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}°C`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Max</span>
                        <span className="font-bold text-primary">{payload[0].value}°C</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Min</span>
                        <span className="font-bold text-primary">{payload[1].value}°C</span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Average</span>
                        <span className="font-bold text-primary">{payload[2].value}°C</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="max" strokeWidth={2} stroke="#2563eb" />
        <Line type="monotone" dataKey="min" strokeWidth={2} stroke="#64748b" />
        <Line type="monotone" dataKey="avg" strokeWidth={2} stroke="#16a34a" />
      </LineChart>
    </ResponsiveContainer>
  )
}
