import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherPredictionChart } from "@/components/weather-prediction-chart"
import { MarkovTransitionMatrix } from "@/components/markov-transition-matrix"
import { WeatherIcon } from "@/components/weather-icon"

export default function PredictionsPage() {
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
            <Link href="/predictions" className="text-sm font-medium text-primary">
              Predictions
            </Link>
            <Link href="/markov-model" className="text-sm font-medium">
              Markov Model
            </Link>
            <Link href="/historical" className="text-sm font-medium">
              Historical Data
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Weather Predictions</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Explore weather predictions based on our Markov Chain model
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Prediction Forecast</CardTitle>
                  <CardDescription>7-day weather prediction based on Markov Chain model</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="temperature">
                    <TabsList className="mb-4">
                      <TabsTrigger value="temperature">Temperature</TabsTrigger>
                      <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
                      <TabsTrigger value="cloud-cover">Cloud Cover</TabsTrigger>
                      <TabsTrigger value="pressure">Pressure</TabsTrigger>
                    </TabsList>
                    <TabsContent value="temperature" className="h-[400px]">
                      <WeatherPredictionChart metric="temperature" />
                    </TabsContent>
                    <TabsContent value="precipitation" className="h-[400px]">
                      <WeatherPredictionChart metric="precipitation" />
                    </TabsContent>
                    <TabsContent value="cloud-cover" className="h-[400px]">
                      <WeatherPredictionChart metric="cloud_cover" />
                    </TabsContent>
                    <TabsContent value="pressure" className="h-[400px]">
                      <WeatherPredictionChart metric="pressure" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Confidence</CardTitle>
                  <CardDescription>Model confidence by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>Day {i + 1}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${100 - i * 8}%` }}></div>
                          </div>
                          <span className="text-sm">{100 - i * 8}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Markov Transition Probabilities</CardTitle>
                <CardDescription>Transition matrix showing the probability of weather state changes</CardDescription>
              </CardHeader>
              <CardContent>
                <MarkovTransitionMatrix />
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
