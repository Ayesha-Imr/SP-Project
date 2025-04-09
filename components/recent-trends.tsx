"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemperatureChart } from "@/components/temperature-chart"
import { PrecipitationChart } from "@/components/precipitation-chart"

export function RecentTrends() {
  const [activeTab, setActiveTab] = useState("temperature")

  return (
    <Tabs defaultValue="temperature" onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="temperature">Temperature</TabsTrigger>
        <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
      </TabsList>
      <TabsContent value="temperature" className="h-[300px]">
        <TemperatureChart />
      </TabsContent>
      <TabsContent value="precipitation" className="h-[300px]">
        <PrecipitationChart />
      </TabsContent>
    </Tabs>
  )
}
