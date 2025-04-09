import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherSummary } from "@/components/weather-summary"
import { RecentTrends } from "@/components/recent-trends"
import { PredictionAccuracy } from "@/components/prediction-accuracy"
import { WeatherIcon } from "@/components/weather-icon"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <WeatherIcon className="h-6 w-6 mr-2" />
            <span className="font-bold">London Weather Predictor</span>
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
            <Link href="/historical" className="text-sm font-medium">
              Historical Data
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  London Weather Prediction
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Using Markov Chain modeling to predict weather patterns based on historical London data
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/predictions">
                  <Button>View Predictions</Button>
                </Link>
                <Link href="/markov-model">
                  <Button variant="outline">Explore Markov Model</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Current Prediction</CardTitle>
                  <CardDescription>Next 24 hours forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeatherSummary />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Weather Trends</CardTitle>
                  <CardDescription>Last 7 days of weather data</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTrends />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Markov Chain Model Performance</CardTitle>
                  <CardDescription>Prediction accuracy metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PredictionAccuracy />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Key Weather Indicators</CardTitle>
                  <CardDescription>Important metrics and KPIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prediction Accuracy</span>
                      <span className="text-2xl font-bold">87.3%</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Model Confidence</span>
                      <span className="text-2xl font-bold">92.1%</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">State Transitions</span>
                      <span className="text-2xl font-bold">24</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Points</span>
                      <span className="text-2xl font-bold">3,652</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
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
