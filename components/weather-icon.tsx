import { Cloud, CloudRain, CloudSnow, Sun, CloudSun } from "lucide-react"

interface WeatherIconProps {
  type?: "sunny" | "cloudy" | "rainy" | "snowy" | "partly-cloudy"
  className?: string
}

export function WeatherIcon({ type = "partly-cloudy", className }: WeatherIconProps) {
  const icons = {
    sunny: <Sun className={className} />,
    cloudy: <Cloud className={className} />,
    rainy: <CloudRain className={className} />,
    snowy: <CloudSnow className={className} />,
    "partly-cloudy": <CloudSun className={className} />,
  }

  return icons[type]
}
