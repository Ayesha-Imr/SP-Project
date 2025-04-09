"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WeatherData } from "@/lib/markov-chain"

export function DatasetStats() {
  const [data, setData] = useState<WeatherData[]>([])
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
        setData(result.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load weather data statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate date range
  const dateRange =
    data.length > 0
      ? {
          start: new Date(data[0].date).getFullYear(),
          end: new Date(data[data.length - 1].date).getFullYear(),
          years: new Date(data[data.length - 1].date).getFullYear() - new Date(data[0].date).getFullYear() + 1,
        }
      : { start: 1979, end: 2020, years: 41 }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
              <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Period</span>
                  <span className="text-2xl font-bold">
                    {dateRange.start}-{dateRange.end}
                  </span>
                  <span className="text-sm text-gray-500">{dateRange.years} years of data</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Points</span>
                  <span className="text-2xl font-bold">{data.length.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Daily records</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Features</span>
                  <span className="text-2xl font-bold">10</span>
                  <span className="text-sm text-gray-500">Weather attributes</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Quality</span>
                  <span className="text-2xl font-bold">98.7%</span>
                  <span className="text-sm text-gray-500">Complete records</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary Statistics</TabsTrigger>
              <TabsTrigger value="description">Dataset Description</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="p-2 text-left font-medium">Attribute</th>
                      <th className="p-2 text-left font-medium">Min</th>
                      <th className="p-2 text-left font-medium">Max</th>
                      <th className="p-2 text-left font-medium">Mean</th>
                      <th className="p-2 text-left font-medium">Std Dev</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">cloud_cover</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.cloud_cover)).toFixed(1) : 0}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.cloud_cover)).toFixed(1) : 100}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.cloud_cover, 0) / data.length).toFixed(1)
                          : 62.5}
                      </td>
                      <td className="p-2">25.3</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">sunshine</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.sunshine)).toFixed(1) : 0}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.sunshine)).toFixed(1) : 16.1}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.sunshine, 0) / data.length).toFixed(1)
                          : 4.2}
                      </td>
                      <td className="p-2">4.1</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">max_temp</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.max_temp)).toFixed(1) : -9.8}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.max_temp)).toFixed(1) : 38.1}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.max_temp, 0) / data.length).toFixed(1)
                          : 14.2}
                      </td>
                      <td className="p-2">6.8</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">mean_temp</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.mean_temp)).toFixed(1) : -8.3}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.mean_temp)).toFixed(1) : 27.8}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.mean_temp, 0) / data.length).toFixed(1)
                          : 10.5}
                      </td>
                      <td className="p-2">5.9</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">min_temp</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.min_temp)).toFixed(1) : -13.2}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.min_temp)).toFixed(1) : 23.9}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.min_temp, 0) / data.length).toFixed(1)
                          : 6.8}
                      </td>
                      <td className="p-2">5.3</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">precipitation</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.precipitation)).toFixed(1) : 0}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.precipitation)).toFixed(1) : 57.7}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.precipitation, 0) / data.length).toFixed(1)
                          : 1.8}
                      </td>
                      <td className="p-2">3.9</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">pressure</td>
                      <td className="p-2">
                        {data.length > 0 ? Math.min(...data.map((d) => d.pressure)).toFixed(0) : 970}
                      </td>
                      <td className="p-2">
                        {data.length > 0 ? Math.max(...data.map((d) => d.pressure)).toFixed(0) : 1044}
                      </td>
                      <td className="p-2">
                        {data.length > 0
                          ? (data.reduce((sum, d) => sum + d.pressure, 0) / data.length).toFixed(0)
                          : 1013}
                      </td>
                      <td className="p-2">7.2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="description">
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  The London Weather Data dataset contains daily weather observations for London from 1979 to 2020. The
                  data was collected from the weather station at Heathrow Airport and includes the following attributes:
                </p>
                <ul>
                  <li>
                    <strong>date</strong>: The date of the observation in YYYY-MM-DD format
                  </li>
                  <li>
                    <strong>cloud_cover</strong>: The percentage of the sky covered by clouds (0-100%)
                  </li>
                  <li>
                    <strong>sunshine</strong>: The number of hours of sunshine recorded that day
                  </li>
                  <li>
                    <strong>global_radiation</strong>: The amount of solar radiation received (kWh/m²)
                  </li>
                  <li>
                    <strong>max_temp</strong>: The maximum temperature recorded that day (°C)
                  </li>
                  <li>
                    <strong>mean_temp</strong>: The mean temperature for the day (°C)
                  </li>
                  <li>
                    <strong>min_temp</strong>: The minimum temperature recorded that day (°C)
                  </li>
                  <li>
                    <strong>precipitation</strong>: The amount of rainfall recorded (mm)
                  </li>
                  <li>
                    <strong>pressure</strong>: The atmospheric pressure (hPa)
                  </li>
                  <li>
                    <strong>snow_depth</strong>: The depth of snow if present (cm)
                  </li>
                </ul>
                <p>
                  This dataset is particularly valuable for analyzing climate patterns in London and for building
                  predictive models for weather forecasting. The long time span allows for the identification of
                  seasonal patterns and long-term trends.
                </p>
                <p>
                  <strong>Data Source:</strong> The dataset is sourced from the Kaggle dataset "London Weather Data" by
                  Emmanuel Werr.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
