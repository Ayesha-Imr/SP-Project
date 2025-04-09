"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MarkovTransitionMatrix() {
  // Sample Markov transition matrix for weather states
  const weatherStates = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain"]
  const transitionMatrix = [
    [0.65, 0.2, 0.1, 0.04, 0.01], // Sunny -> [Sunny, Partly Cloudy, Cloudy, Light Rain, Heavy Rain]
    [0.25, 0.45, 0.2, 0.08, 0.02], // Partly Cloudy -> [...]
    [0.1, 0.25, 0.4, 0.2, 0.05], // Cloudy -> [...]
    [0.05, 0.15, 0.3, 0.4, 0.1], // Light Rain -> [...]
    [0.01, 0.09, 0.25, 0.35, 0.3], // Heavy Rain -> [...]
  ]

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">From \ To</TableHead>
            {weatherStates.map((state) => (
              <TableHead key={state}>{state}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {weatherStates.map((fromState, fromIndex) => (
            <TableRow key={fromState}>
              <TableCell className="font-medium">{fromState}</TableCell>
              {transitionMatrix[fromIndex].map((probability, toIndex) => (
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
