"use client"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  {
    date: "Mon",
    amount: 2.5,
  },
  {
    date: "Tue",
    amount: 5.2,
  },
  {
    date: "Wed",
    amount: 3.1,
  },
  {
    date: "Thu",
    amount: 0.8,
  },
  {
    date: "Fri",
    amount: 0.2,
  },
  {
    date: "Sat",
    amount: 1.5,
  },
  {
    date: "Sun",
    amount: 4.3,
  },
]

export function PrecipitationChart() {
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
        <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
