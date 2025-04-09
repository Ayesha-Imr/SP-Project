/**
 * Data loading and processing utilities
 *
 * This module provides functions for loading and processing the London weather dataset.
 */

import type { WeatherData } from "./markov-chain"
import fs from "fs/promises"
import path from "path"

// Sample data for development (would be replaced with actual data loading in production)
export const sampleData: WeatherData[] = [
  {
    date: "2020-01-01",
    cloud_cover: 75,
    sunshine: 1.2,
    global_radiation: 1.5,
    max_temp: 8.2,
    mean_temp: 5.7,
    min_temp: 3.1,
    precipitation: 2.5,
    pressure: 1012,
    snow_depth: 0,
  },
  {
    date: "2020-01-02",
    cloud_cover: 80,
    sunshine: 0.8,
    global_radiation: 1.2,
    max_temp: 7.5,
    mean_temp: 5.2,
    min_temp: 2.8,
    precipitation: 4.2,
    pressure: 1008,
    snow_depth: 0,
  },
  // More sample data would be added here
]

/**
 * Parse a CSV string into an array of WeatherData objects
 */
function parseCSV(csvString: string): WeatherData[] {
  const lines = csvString.trim().split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const entry: any = {}

    headers.forEach((header, index) => {
      // Convert numeric values to numbers
      if (header !== "date") {
        entry[header] = Number.parseFloat(values[index])
      } else {
        entry[header] = values[index]
      }
    })

    return entry as WeatherData
  })
}

/**
 * Loads weather data from a CSV file if it exists, otherwise returns sample data
 */
export async function loadWeatherData(filePath = "public/london_weather.csv"): Promise<WeatherData[]> {
  try {
    // Check if file exists and read it
    const fullPath = path.resolve(process.cwd(), filePath)
    const fileData = await fs.readFile(fullPath, "utf8")

    console.log(`Successfully loaded data from ${fullPath}`)
    return parseCSV(fileData)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Could not load data from file: ${errorMessage}. Using sample data instead.`)
    return sampleData
  }
}

/**
 * Filters weather data by date range
 */
export function filterByDateRange(data: WeatherData[], startDate: string, endDate: string): WeatherData[] {
  return data.filter((item) => {
    const date = new Date(item.date)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })
}

/**
 * Calculates summary statistics for a weather dataset
 */
export function calculateStats(data: WeatherData[]) {
  const stats = {
    temperature: {
      min: Number.MAX_VALUE,
      max: Number.MIN_VALUE,
      mean: 0,
      stdDev: 0,
    },
    precipitation: {
      min: Number.MAX_VALUE,
      max: Number.MIN_VALUE,
      mean: 0,
      stdDev: 0,
    },
    // Add more metrics as needed
  }

  // Calculate min, max, and sum for mean
  data.forEach((item) => {
    // Temperature stats
    stats.temperature.min = Math.min(stats.temperature.min, item.mean_temp)
    stats.temperature.max = Math.max(stats.temperature.max, item.mean_temp)
    stats.temperature.mean += item.mean_temp

    // Precipitation stats
    stats.precipitation.min = Math.min(stats.precipitation.min, item.precipitation)
    stats.precipitation.max = Math.max(stats.precipitation.max, item.precipitation)
    stats.precipitation.mean += item.precipitation
  })

  // Calculate means
  stats.temperature.mean /= data.length
  stats.precipitation.mean /= data.length

  // Calculate standard deviations
  data.forEach((item) => {
    const tempDiff = item.mean_temp - stats.temperature.mean
    const precipDiff = item.precipitation - stats.precipitation.mean

    stats.temperature.stdDev += tempDiff * tempDiff
    stats.precipitation.stdDev += precipDiff * precipDiff
  })

  stats.temperature.stdDev = Math.sqrt(stats.temperature.stdDev / data.length)
  stats.precipitation.stdDev = Math.sqrt(stats.precipitation.stdDev / data.length)

  return stats
}
