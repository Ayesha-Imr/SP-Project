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
export async function loadWeatherData(relativePath = "london_weather.csv"): Promise<WeatherData[]> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  const fileUrl = `${appUrl}/${relativePath}`;

  try {
    // Attempt 1: Fetch via HTTP (preferred for Vercel)
    console.log(`Attempting to fetch data from URL: ${fileUrl}`);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      // Log the status and statusText for more detailed debugging
      console.warn(`Fetch failed with status: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch ${fileUrl}: ${response.statusText}`);
    }

    const fileData = await response.text();
    console.log(`Successfully loaded data via fetch from ${fileUrl}`);
    return parseCSV(fileData);

  } catch (fetchError: unknown) {
    const fetchErrorMessage = fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
    console.warn(`Could not load data via fetch (${fetchErrorMessage}). Falling back.`);

    // Attempt 2: Filesystem (might work locally, less likely on Vercel serverless)
    const filePath = path.join(process.cwd(), "public", relativePath);
    try {
      console.log(`Attempting to read data from filesystem: ${filePath}`);
      const fileData = await fs.readFile(filePath, "utf8");
      console.log(`Successfully loaded data from filesystem: ${filePath}`);
      return parseCSV(fileData);
    } catch (fsError: unknown) {
      const fsErrorMessage = fsError instanceof Error ? fsError.message : "Unknown filesystem error";
      console.warn(`Could not load data from filesystem (${fsErrorMessage}). Using sample data instead.`);
      // Attempt 3: Fallback to sample data
      return sampleData;
    }
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
