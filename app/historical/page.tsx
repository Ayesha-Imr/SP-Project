import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoricalDataTable } from "@/components/historical-data-table"
import { HistoricalDataChart } from "@/components/historical-data-chart"
import { DatasetStats } from "@/components/dataset-stats"
import { WeatherIcon } from "@/components/weather-icon"

export default function HistoricalDataPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <WeatherIcon className="h-6 w-6 mr-2" />
            <Link href="/" className="font-bold">
              London Weather Predictor
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/predictions" className="text-sm font-medium">
              Predictions
            </Link>
            <Link href="/markov-model" className="text-sm font-medium">
              Markov Model
            </Link>
            <Link href="/historical" className="text-sm font-medium text-primary">
              Historical Data
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Historical Weather Data</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Explore the London weather dataset used for our predictions
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Dataset Overview</CardTitle>
                <CardDescription>London weather data statistics and information</CardDescription>
              </CardHeader>
              <CardContent>
                <DatasetStats />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Historical Data Visualization</CardTitle>
                <CardDescription>Visual representation of historical weather data</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="temperature">
                  <TabsList className="mb-4">
                    <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
                    <TabsTrigger value="cloud-cover">Cloud Cover</TabsTrigger>
                    <TabsTrigger value="pressure">Pressure</TabsTrigger>
                    <TabsTrigger value="sunshine">Sunshine</TabsTrigger>
                  </TabsList>
                  <TabsContent value="temperature" className="h-[400px]">
                    <HistoricalDataChart metric="temperature" />
                  </TabsContent>
                  <TabsContent value="precipitation" className="h-[400px]">
                    <HistoricalDataChart metric="precipitation" />
                  </TabsContent>
                  <TabsContent value="cloud-cover" className="h-[400px]">
                    <HistoricalDataChart metric="cloud_cover" />
                  </TabsContent>
                  <TabsContent value="pressure" className="h-[400px]">
                    <HistoricalDataChart metric="pressure" />
                  </TabsContent>
                  <TabsContent value="sunshine" className="h-[400px]">
                    <HistoricalDataChart metric="sunshine" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Raw Data</CardTitle>
                <CardDescription>Browse the raw historical weather data</CardDescription>
              </CardHeader>
              <CardContent>
                <HistoricalDataTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 London Weather Predictor. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
