"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CloudRain, CloudSun, Droplets, Wind } from "lucide-react"

export function WeatherSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <CloudSun className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-xl font-bold">Partly Cloudy</p>
              <p className="text-sm">High: 18°C / Low: 12°C</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <CloudRain className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow</p>
              <p className="text-xl font-bold">Light Rain</p>
              <p className="text-sm">High: 16°C / Low: 11°C</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Precipitation</p>
              <p className="text-xl font-bold">60% Chance</p>
              <p className="text-sm">Expected: 2.5mm</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Wind className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-xl font-bold">1012 hPa</p>
              <p className="text-sm">Falling</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
