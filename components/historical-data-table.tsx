"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { WeatherData } from "@/lib/markov-chain"

export function HistoricalDataTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [data, setData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 5
  const pageCount = Math.ceil(data.length / itemsPerPage)

  // Filter data based on search term
  const filteredData = data.filter((item) => item.date.toLowerCase().includes(search.toLowerCase()))

  // Get current page data
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

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
        setError("Failed to load weather data. Using sample data instead.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
          <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search by date..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1) // Reset to first page on search
            }}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cloud Cover (%)</TableHead>
                  <TableHead>Sunshine (h)</TableHead>
                  <TableHead>Max Temp (°C)</TableHead>
                  <TableHead>Mean Temp (°C)</TableHead>
                  <TableHead>Min Temp (°C)</TableHead>
                  <TableHead>Precipitation (mm)</TableHead>
                  <TableHead>Pressure (hPa)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.cloud_cover}</TableCell>
                      <TableCell>{row.sunshine}</TableCell>
                      <TableCell>{row.max_temp}</TableCell>
                      <TableCell>{row.mean_temp}</TableCell>
                      <TableCell>{row.min_temp}</TableCell>
                      <TableCell>{row.precipitation}</TableCell>
                      <TableCell>{row.pressure}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.max(1, page - 1))
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(3, pageCount) }, (_, i) => {
                const pageNum = page <= 2 ? i + 1 : page - 1 + i
                if (pageNum <= pageCount) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === page}
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(pageNum)
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.min(pageCount, page + 1))
                  }}
                  className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  )
}
