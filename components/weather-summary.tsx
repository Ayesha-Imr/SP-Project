"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { WeatherIcon } from "@/components/weather-icon"
import type { WeatherData } from "@/lib/markov-chain"
import { getWeatherState } from "@/lib/markov-chain"

export function WeatherSummary() {
  const [currentWeather, setCurrentWeather] = useState<{
    temperature: number;
    condition: string;
    description: string;
    precipitation: number;
  } | null>(null)
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
          // Get the most recent data point
          const processedData = processWeatherData(weatherData)
          setCurrentWeather(processedData)
        } else {
          // Fall back to default values if no data
          setCurrentWeather(getDefaultData())
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load weather summary data")
        setCurrentWeather(getDefaultData()) // Use default data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process weather data to extract current conditions
  function processWeatherData(weatherData: WeatherData[]) {
    // Sort by date and get the most recent data point
    const sortedData = [...weatherData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    const latestData = sortedData[sortedData.length - 1]
    
    // Determine weather condition based on weather state
    const weatherState = getWeatherState(latestData)
    
    // Map the weather state to a condition and description
    let condition = "Cloudy"
    let description = "Partly cloudy conditions expected"
    
    if (weatherState.id.includes("dry") && (weatherState.id.includes("hot") || weatherState.id.includes("warm"))) {
      condition = "Sunny"
      description = "Clear skies with sunshine expected"
    } else if (weatherState.id.includes("wet")) {
      if (latestData.precipitation > 5) {
        condition = "Rainy"
        description = "Heavy rain expected throughout the day"
      } else {
        condition = "Light Rain"
        description = "Light rain expected intermittently"
      }
    } else if (weatherState.id.includes("cold")) {
      if (latestData.precipitation > 0) {
        condition = "Snow"
        description = "Snow expected with cold temperatures"
      } else {
        condition = "Cold"
        description = "Cold clear conditions expected"
      }
    }
    
    return {
      temperature: Math.round(latestData.mean_temp),
      condition,
      description,
      precipitation: Math.round(latestData.precipitation * 10) / 10 // Round to 1 decimal place
    }
  }
  
  // Default data when API call fails or returns no data
  function getDefaultData() {
    return {
      temperature: 15,
      condition: "Partly Cloudy",
      description: "Partly cloudy conditions with a chance of rain later",
      precipitation: 2.5
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Loading weather data...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!currentWeather) {
    return null
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <WeatherIcon className="h-10 w-10 sm:h-14 sm:w-14" condition={currentWeather.condition.toLowerCase()} />
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="text-xl font-semibold sm:text-3xl">
            {currentWeather.temperature}°C
          </div>
          <div className="text-sm text-muted-foreground sm:text-base">
            {currentWeather.condition}
          </div>
        </div>
      </div>
      <div className="grid gap-1">
        <div className="text-sm font-medium">Today&apos;s Forecast</div>
        <div className="text-sm text-muted-foreground">
          {currentWeather.description}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="text-sm font-medium">Precipitation</div>
          <div className="text-xl font-semibold">{currentWeather.precipitation} mm</div>
        </Card>
        <Card className="p-3">
          <div className="text-sm font-medium">Chance of Rain</div>
          <div className="text-xl font-semibold">{currentWeather.precipitation > 0 ? Math.min(95, Math.round(currentWeather.precipitation * 15)) : 0}%</div>
        </Card>
      </div>
    </div>
  )
}
