"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function PredictionControls() {
  const [days, setDays] = useState(7)
  const [confidence, setConfidence] = useState(85)
  const [showBounds, setShowBounds] = useState(true)
  const [modelType, setModelType] = useState("markov")
  const { toast } = useToast()

  const handleUpdatePrediction = () => {
    // In a real application, this would update the prediction data
    // based on the selected parameters
    toast({
      title: "Predictions Updated",
      description: `Updated with: ${days} days, ${confidence}% confidence, ${modelType} model${showBounds ? ", showing bounds" : ""}`,
      duration: 3000,
    })

    // This is where you would typically call an API or update a global state
    console.log("Updating predictions with:", {
      days,
      confidence,
      showBounds,
      modelType,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Prediction Days</Label>
        <div className="flex items-center gap-2">
          <Slider value={[days]} min={1} max={14} step={1} onValueChange={(value) => setDays(value[0])} />
          <span className="w-12 text-center">{days}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Confidence Level</Label>
        <div className="flex items-center gap-2">
          <Slider value={[confidence]} min={50} max={99} step={1} onValueChange={(value) => setConfidence(value[0])} />
          <span className="w-12 text-center">{confidence}%</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="show-bounds" checked={showBounds} onCheckedChange={setShowBounds} />
        <Label htmlFor="show-bounds">Show Confidence Bounds</Label>
      </div>
      <div className="space-y-2">
        <Label>Model Type</Label>
        <Select value={modelType} onValueChange={setModelType}>
          <SelectTrigger>
            <SelectValue placeholder="Select model type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="markov">Markov Chain</SelectItem>
            <SelectItem value="regression">Linear Regression</SelectItem>
            <SelectItem value="neural">Neural Network</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full" onClick={handleUpdatePrediction}>
        Update Prediction
      </Button>
    </div>
  )
}
