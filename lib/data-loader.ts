/**
 * Data loading and processing utilities
 *
 * This module provides functions for loading and processing the London weather dataset.
 */

import type { WeatherData } from "./markov-chain"
import path from "path"

// Expanded sample data for when data loading fails
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
  {
    date: "2020-01-03",
    cloud_cover: 65,
    sunshine: 2.1,
    global_radiation: 1.8,
    max_temp: 9.0,
    mean_temp: 6.5,
    min_temp: 4.0,
    precipitation: 1.0,
    pressure: 1015,
    snow_depth: 0,
  },
  {
    date: "2020-01-04",
    cloud_cover: 45,
    sunshine: 3.5,
    global_radiation: 2.2,
    max_temp: 10.3,
    mean_temp: 7.2,
    min_temp: 4.1,
    precipitation: 0.2,
    pressure: 1018,
    snow_depth: 0,
  },
  {
    date: "2020-01-05",
    cloud_cover: 30,
    sunshine: 5.0,
    global_radiation: 2.5,
    max_temp: 11.2,
    mean_temp: 8.0,
    min_temp: 4.8,
    precipitation: 0.0,
    pressure: 1020,
    snow_depth: 0,
  },
  {
    date: "2020-01-06",
    cloud_cover: 40,
    sunshine: 4.2,
    global_radiation: 2.3,
    max_temp: 10.8,
    mean_temp: 7.5,
    min_temp: 4.2,
    precipitation: 0.5,
    pressure: 1016,
    snow_depth: 0,
  },
  {
    date: "2020-01-07",
    cloud_cover: 60,
    sunshine: 2.8,
    global_radiation: 1.7,
    max_temp: 9.5,
    mean_temp: 6.8,
    min_temp: 4.1,
    precipitation: 1.2,
    pressure: 1012,
    snow_depth: 0,
  },
  {
    date: "2020-01-08",
    cloud_cover: 85,
    sunshine: 0.5,
    global_radiation: 1.0,
    max_temp: 7.8,
    mean_temp: 5.0,
    min_temp: 2.2,
    precipitation: 5.5,
    pressure: 1005,
    snow_depth: 0,
  },
  {
    date: "2020-01-09",
    cloud_cover: 90,
    sunshine: 0.2,
    global_radiation: 0.8,
    max_temp: 6.5,
    mean_temp: 3.8,
    min_temp: 1.1,
    precipitation: 8.2,
    pressure: 1000,
    snow_depth: 0,
  },
  {
    date: "2020-01-10",
    cloud_cover: 75,
    sunshine: 1.0,
    global_radiation: 1.2,
    max_temp: 7.0,
    mean_temp: 4.5,
    min_temp: 2.0,
    precipitation: 3.0,
    pressure: 1003,
    snow_depth: 0,
  }
]

/**
 * Parse a CSV string into an array of WeatherData objects
 */
function parseCSV(csvString: string): WeatherData[] {
  try {
    const lines = csvString.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("CSV data has insufficient lines")
    }
    
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
  } catch (e) {
    console.error("Failed to parse CSV data:", e)
    return [] // Return empty array on parsing error
  }
}

/**
 * Loads weather data from a CSV file if it exists, otherwise returns sample data
 */
export async function loadWeatherData(relativePath = "london_weather.csv"): Promise<WeatherData[]> {
  // Try multiple possible URLs for the data file
  const possibleUrls = [
    `/api/data/${relativePath}`, // Try API endpoint first
    `/${relativePath}`,          // Then try root path
    `/public/${relativePath}`,   // Then try public path
    `https://raw.githubusercontent.com/emmanuelfwerr/London-Weather-Data/main/london_weather.csv` // External URL as fallback
  ];
  
  // In development, also try localhost URL
  if (process.env.NODE_ENV === 'development') {
    const devPort = process.env.PORT || 3000;
    possibleUrls.unshift(`http://localhost:${devPort}/${relativePath}`);
  }

  // Try each URL in sequence
  for (const url of possibleUrls) {
    try {
      console.log(`Attempting to fetch data from URL: ${url}`);
      const response = await fetch(url, { 
        method: 'GET',
        cache: 'no-cache', // Bypass cache
        headers: {
          'Content-Type': 'text/csv',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        console.warn(`Fetch failed for ${url} with status: ${response.status}`);
        continue; // Try next URL
      }

      const fileData = await response.text();
      if (fileData.length < 100) {
        console.warn(`Data from ${url} too short (${fileData.length} bytes), skipping`);
        continue;
      }
      
      const parsedData = parseCSV(fileData);
      if (parsedData.length > 0) {
        console.log(`Successfully loaded ${parsedData.length} records from ${url}`);
        return parsedData;
      } else {
        console.warn(`Failed to parse data from ${url}`);
      }
    } catch (error) {
      console.warn(`Error fetching from ${url}:`, error);
      // Continue to next URL
    }
  }
  
  // If we're on the server, try filesystem as last resort
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs/promises');
      const filePath = path.join(process.cwd(), 'public', relativePath);
      console.log(`Attempting to read data from filesystem: ${filePath}`);
      const fileData = await fs.readFile(filePath, "utf8");
      
      const parsedData = parseCSV(fileData);
      if (parsedData.length > 0) {
        console.log(`Successfully loaded ${parsedData.length} records from filesystem`);
        return parsedData;
      }
    } catch (error) {
      console.error(`Filesystem fallback failed:`, error);
    }
  }
  
  // All attempts failed, use sample data
  console.log('All data loading attempts failed, using sample data');
  return sampleData;
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
