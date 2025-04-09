import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkovStateGraph } from "@/components/markov-state-graph"
import { MarkovTransitionMatrix } from "@/components/markov-transition-matrix"
import { MarkovPredictionAccuracy } from "@/components/markov-prediction-accuracy"
import { WeatherIcon } from "@/components/weather-icon"

export default function MarkovModelPage() {
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
            <Link href="/markov-model" className="text-sm font-medium text-primary">
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
              <h1 className="text-3xl font-bold tracking-tighter">Markov Chain Model</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Explore the Markov Chain model used for weather predictions
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>What is a Markov Chain?</CardTitle>
                <CardDescription>Understanding the model behind our predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <p>
                    A Markov Chain is a mathematical system that experiences transitions from one state to another
                    according to certain probabilistic rules. The defining characteristic of a Markov Chain is that the
                    probability of transitioning to any particular state depends solely on the current state and time
                    elapsed.
                  </p>
                  <p>
                    In our weather prediction model, we define weather states based on temperature ranges, precipitation
                    levels, and other meteorological factors. The Markov Chain then calculates the probability of
                    transitioning from one weather state to another based on historical data.
                  </p>
                  <p>
                    For example, if it's sunny today in London, the model calculates the probability of it being sunny,
                    rainy, or cloudy tomorrow based on historical patterns of weather transitions. This memoryless
                    property makes Markov Chains particularly suitable for weather prediction.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Markov State Graph</CardTitle>
                  <CardDescription>Visual representation of weather state transitions</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MarkovStateGraph />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transition Matrix</CardTitle>
                  <CardDescription>Probability of transitioning between weather states</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MarkovTransitionMatrix />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Accuracy and reliability metrics for our Markov Chain model</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="accuracy">
                  <TabsList className="mb-4">
                    <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
                    <TabsTrigger value="reliability">Model Reliability</TabsTrigger>
                    <TabsTrigger value="comparison">Comparison with Other Models</TabsTrigger>
                  </TabsList>
                  <TabsContent value="accuracy" className="h-[400px]">
                    <MarkovPredictionAccuracy />
                  </TabsContent>
                  <TabsContent value="reliability" className="h-[400px]">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold">Model Reliability</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Our Markov Chain model maintains 85% reliability up to 5 days in advance
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="h-4 w-64 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="comparison" className="h-[400px]">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold">Model Comparison</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Our Markov Chain model compared to other prediction methods
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Markov Chain</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: "87%" }}></div>
                              </div>
                              <span className="text-sm">87%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Linear Regression</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-green-500" style={{ width: "72%" }}></div>
                              </div>
                              <span className="text-sm">72%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Neural Network</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-purple-500" style={{ width: "91%" }}></div>
                              </div>
                              <span className="text-sm">91%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
