"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WeatherData } from "@/lib/markov-chain"
import { buildTransitionMatrix, weatherStates } from "@/lib/markov-chain"

export function MarkovTransitionMatrix() {
  const [matrix, setMatrix] = useState<number[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Simplified weather states for display (based on the full weatherStates from markov-chain.ts)
  const displayWeatherStates = [
    "Sunny",
    "Partly Cloudy",
    "Cloudy",
    "Light Rain",
    "Heavy Rain"
  ]
  
  // Mapping of internal state IDs to display states
  const stateMapping: {[key: string]: number} = {
    'hot-dry': 0,
    'warm-dry': 0,
    'hot-wet': 1,
    'warm-wet': 1,
    'cool-dry': 2,
    'cool-wet': 3,
    'cold-dry': 2,
    'cold-wet': 4
  }

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
          // Calculate transition matrix based on historical data
          const fullMatrix = buildTransitionMatrix(weatherData)
          const simplifiedMatrix = simplifyTransitionMatrix(fullMatrix)
          setMatrix(simplifiedMatrix)
        } else {
          // Fall back to default values if no data
          setMatrix(getDefaultTransitionMatrix())
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load transition matrix data")
        setMatrix(getDefaultTransitionMatrix()) // Use default data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  
  // Simplify the 8-state matrix to the 5-state display matrix
  function simplifyTransitionMatrix(fullMatrix: number[][]): number[][] {
    // Initialize simplified 5x5 matrix with zeros
    const simplifiedMatrix = Array(5).fill(0).map(() => Array(5).fill(0))
    const stateCounts = Array(5).fill(0)
    
    // For each weather state in the full matrix
    for (let fromIdx = 0; fromIdx < weatherStates.length; fromIdx++) {
      const fromDisplayIdx = stateMapping[weatherStates[fromIdx].id]
      
      for (let toIdx = 0; toIdx < weatherStates.length; toIdx++) {
        const toDisplayIdx = stateMapping[weatherStates[toIdx].id] 
        
        // Add probability to the simplified matrix
        simplifiedMatrix[fromDisplayIdx][toDisplayIdx] += fullMatrix[fromIdx][toIdx]
      }
      
      stateCounts[fromDisplayIdx]++
    }
    
    // Normalize the matrix so each row sums to 1
    for (let i = 0; i < 5; i++) {
      const rowSum = simplifiedMatrix[i].reduce((a, b) => a + b, 0)
      if (rowSum > 0) {
        for (let j = 0; j < 5; j++) {
          simplifiedMatrix[i][j] /= rowSum
        }
      } else {
        // If a state doesn't exist in the data, use default probabilities
        const defaultRow = getDefaultTransitionMatrix()[i]
        for (let j = 0; j < 5; j++) {
          simplifiedMatrix[i][j] = defaultRow[j]
        }
      }
    }
    
    return simplifiedMatrix
  }
  
  // Default transition matrix if no data is available
  function getDefaultTransitionMatrix(): number[][] {
    return [
      [0.65, 0.2, 0.1, 0.04, 0.01], // Sunny -> [Sunny, Partly Cloudy, Cloudy, Light Rain, Heavy Rain]
      [0.25, 0.45, 0.2, 0.08, 0.02], // Partly Cloudy -> [...]
      [0.1, 0.25, 0.4, 0.2, 0.05],   // Cloudy -> [...]
      [0.05, 0.15, 0.3, 0.4, 0.1],    // Light Rain -> [...]
      [0.01, 0.09, 0.25, 0.35, 0.3],  // Heavy Rain -> [...]
    ]
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading transition matrix data...</p>
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
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">From \ To</TableHead>
            {displayWeatherStates.map((state) => (
              <TableHead key={state}>{state}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayWeatherStates.map((fromState, fromIndex) => (
            <TableRow key={fromState}>
              <TableCell className="font-medium">{fromState}</TableCell>
              {matrix[fromIndex].map((probability, toIndex) => (
                <TableCell key={`${fromIndex}-${toIndex}`} className="text-center">
                  <div className="flex flex-col items-center">
                    <span className={probability > 0.3 ? "font-bold" : ""}>{(probability * 100).toFixed(0)}%</span>
                    <div className="h-1 w-12 bg-gray-100 dark:bg-gray-800 mt-1">
                      <div className="h-full bg-blue-500" style={{ width: `${probability * 100}%` }}></div>
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
