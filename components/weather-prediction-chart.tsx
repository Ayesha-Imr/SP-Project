"use client"
import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/markov-chain"
import { buildTransitionMatrix, getWeatherState, weatherStates } from "@/lib/markov-chain"

type MetricType = 'temperature' | 'precipitation' | 'cloud_cover' | 'pressure';

interface WeatherPredictionChartProps {
  metric: MetricType
}

export function WeatherPredictionChart({ metric }: WeatherPredictionChartProps) {
  const [data, setData] = useState<Array<{day: string, actual: number | null, predicted: number, lower: number, upper: number}>>([])
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
          // Generate prediction data based on historical data
          const predictionData = generatePredictionData(weatherData, metric)
          setData(predictionData)
        } else {
          // Fall back to default values if no data
          setData(getDefaultData(metric))
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(`Failed to load ${metric} prediction data`)
        setData(getDefaultData(metric)) // Use default data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [metric])

  // Generate prediction data based on historical weather data
  function generatePredictionData(weatherData: WeatherData[], metricType: MetricType) {
    // Sort data chronologically
    const sortedData = [...weatherData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    // Use the last 3 days as actual data, and predict 4 more days
    const actualDays = 3
    const futureDays = 4
    const recentData = sortedData.slice(-actualDays)
    
    if (recentData.length < 1) {
      return getDefaultData(metricType)
    }
    
    // Build transition matrix from historical data for predictions
    const transitionMatrix = buildTransitionMatrix(weatherData)
    
    // Get the current state (from the most recent data point)
    const mostRecentData = recentData[recentData.length - 1]
    const currentState = getWeatherState(mostRecentData)
    const currentStateIdx = weatherStates.findIndex(s => s.id === currentState.id)
    
    // Create day names for the chart
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = new Date()
    const todayIndex = today.getDay() - 1 // 0 = Monday in our array
    
    // Generate prediction results
    const results = []
    
    // Add actual days (past data)
    for (let i = 0; i < recentData.length; i++) {
      const dataPoint = recentData[i]
      const dayIndex = (todayIndex - (recentData.length - 1) + i + 7) % 7
      
      // Get the actual value for this metric
      let actualValue = 0
      switch (metricType) {
        case 'temperature': 
          actualValue = dataPoint.mean_temp
          break
        case 'precipitation': 
          actualValue = dataPoint.precipitation
          break
        case 'cloud_cover': 
          actualValue = dataPoint.cloud_cover
          break
        case 'pressure': 
          actualValue = dataPoint.pressure
          break
      }
      
      // Get predicted value (simplified for the actual days - just use the actual with some variation)
      const confidence = 0.1 // 10% variation for confidence interval
      const predicted = actualValue
      const lower = actualValue * (1 - confidence)
      const upper = actualValue * (1 + confidence)
      
      results.push({
        day: dayNames[dayIndex],
        actual: parseFloat(actualValue.toFixed(1)),
        predicted: parseFloat(predicted.toFixed(1)),
        lower: parseFloat(lower.toFixed(1)),
        upper: parseFloat(upper.toFixed(1)),
      })
    }
    
    // Add future predictions
    let predictedStateIdx = currentStateIdx
    for (let i = 0; i < futureDays; i++) {
      // Calculate the day index
      const dayIndex = (todayIndex + i + 1) % 7
      
      // Predict the next state
      if (predictedStateIdx >= 0 && predictedStateIdx < transitionMatrix.length) {
        try {
          predictedStateIdx = predictNextState(predictedStateIdx, transitionMatrix)
          
          // Get the predicted value from the state ranges
          let predictedValue = 0
          let range = 0
          
          switch (metricType) {
            case 'temperature':
              const [minTemp, maxTemp] = weatherStates[predictedStateIdx].tempRange
              predictedValue = (minTemp + maxTemp) / 2
              range = (maxTemp - minTemp) / 2
              break
            case 'precipitation':
              const [minPrecip, maxPrecip] = weatherStates[predictedStateIdx].precipRange
              predictedValue = (minPrecip + maxPrecip) / 2
              range = (maxPrecip - minPrecip) / 2
              break
            case 'cloud_cover':
              const [minCloud, maxCloud] = weatherStates[predictedStateIdx].cloudRange
              predictedValue = (minCloud + maxCloud) / 2
              range = (maxCloud - minCloud) / 2
              break
            case 'pressure':
              // Pressure isn't part of weather states, so estimate based on recent average
              const avgPressure = recentData.reduce((sum, d) => sum + d.pressure, 0) / recentData.length
              predictedValue = avgPressure
              range = 5 // Typical pressure variation
              break
          }
          
          // Add the prediction with confidence bounds
          results.push({
            day: dayNames[dayIndex],
            actual: null, // Future data has no actual value
            predicted: parseFloat(predictedValue.toFixed(1)),
            lower: parseFloat((predictedValue - range).toFixed(1)),
            upper: parseFloat((predictedValue + range).toFixed(1)),
          })
        } catch (err) {
          console.error("Error in prediction:", err)
          // Use a default value in case of error
          const defaultValues = getDefaultData(metricType)
          const defaultIndex = Math.min(i, defaultValues.length - 1)
          results.push(defaultValues[defaultIndex])
        }
      }
    }
    
    return results
  }
  
  // Function to simulate next state prediction (same as in markov-chain.ts)
  function predictNextState(currentStateIdx: number, transitionMatrix: number[][]): number {
    if (!transitionMatrix[currentStateIdx]) {
      return 0 // Default to first state if invalid index
    }
    
    const probabilities = transitionMatrix[currentStateIdx]
    const random = Math.random()
    let cumulativeProbability = 0

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i]
      if (random < cumulativeProbability) {
        return i
      }
    }

    // Default to the last state if something goes wrong
    return probabilities.length - 1
  }
  
  // Default data for each metric type
  function getDefaultData(metricType: MetricType) {
    switch(metricType) {
      case 'temperature':
        return [
          { day: "Mon", actual: 18, predicted: 17.5, lower: 16, upper: 19 },
          { day: "Tue", actual: 16, predicted: 16.2, lower: 15, upper: 17.5 },
          { day: "Wed", actual: 17, predicted: 16.5, lower: 15, upper: 18 },
          { day: "Thu", actual: null, predicted: 15.8, lower: 14, upper: 17.5 },
          { day: "Fri", actual: null, predicted: 14.5, lower: 13, upper: 16 },
          { day: "Sat", actual: null, predicted: 16.2, lower: 14.5, upper: 18 },
          { day: "Sun", actual: null, predicted: 17.8, lower: 16, upper: 19.5 },
        ]
      case 'precipitation':
        return [
          { day: "Mon", actual: 2.5, predicted: 2.2, lower: 1.5, upper: 3.0 },
          { day: "Tue", actual: 5.2, predicted: 4.8, lower: 3.5, upper: 6.0 },
          { day: "Wed", actual: 3.1, predicted: 3.5, lower: 2.0, upper: 5.0 },
          { day: "Thu", actual: null, predicted: 1.2, lower: 0.5, upper: 2.0 },
          { day: "Fri", actual: null, predicted: 0.5, lower: 0.0, upper: 1.5 },
          { day: "Sat", actual: null, predicted: 2.8, lower: 1.5, upper: 4.0 },
          { day: "Sun", actual: null, predicted: 4.5, lower: 3.0, upper: 6.0 },
        ]
      case 'cloud_cover':
        return [
          { day: "Mon", actual: 65, predicted: 60, lower: 50, upper: 70 },
          { day: "Tue", actual: 80, predicted: 75, lower: 65, upper: 85 },
          { day: "Wed", actual: 70, predicted: 65, lower: 55, upper: 75 },
          { day: "Thu", actual: null, predicted: 55, lower: 45, upper: 65 },
          { day: "Fri", actual: null, predicted: 40, lower: 30, upper: 50 },
          { day: "Sat", actual: null, predicted: 60, lower: 50, upper: 70 },
          { day: "Sun", actual: null, predicted: 75, lower: 65, upper: 85 },
        ]
      case 'pressure':
        return [
          { day: "Mon", actual: 1012, predicted: 1010, lower: 1008, upper: 1012 },
          { day: "Tue", actual: 1008, predicted: 1006, lower: 1004, upper: 1008 },
          { day: "Wed", actual: 1010, predicted: 1012, lower: 1010, upper: 1014 },
          { day: "Thu", actual: null, predicted: 1014, lower: 1012, upper: 1016 },
          { day: "Fri", actual: null, predicted: 1016, lower: 1014, upper: 1018 },
          { day: "Sat", actual: null, predicted: 1012, lower: 1010, upper: 1014 },
          { day: "Sun", actual: null, predicted: 1008, lower: 1006, upper: 1010 },
        ]
      default:
        return []
    }
  }
  
  const units: Record<MetricType, string> = {
    temperature: "°C",
    precipitation: "mm",
    cloud_cover: "%",
    pressure: "hPa",
  }

  const unit = units[metric] || ""

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading prediction data...</p>
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
      <LineChart data={data}>
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
