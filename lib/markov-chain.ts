/**
 * Markov Chain implementation for weather prediction
 *
 * This module implements a Markov Chain model for predicting weather patterns
 * based on historical data. It defines weather states, calculates transition
 * probabilities, and provides methods for predicting future weather states.
 */

// Define weather state types
export type WeatherState = {
  id: string
  name: string
  tempRange: [number, number]
  precipRange: [number, number]
  cloudRange: [number, number]
}

// Define the structure of weather data
export type WeatherData = {
  date: string
  cloud_cover: number
  sunshine: number
  global_radiation: number
  max_temp: number
  mean_temp: number
  min_temp: number
  precipitation: number
  pressure: number
  snow_depth: number
}

// Define weather states based on temperature and precipitation
export const weatherStates: WeatherState[] = [
  { id: "hot-dry", name: "Hot & Dry", tempRange: [25, 40], precipRange: [0, 1], cloudRange: [0, 30] },
  { id: "hot-wet", name: "Hot & Wet", tempRange: [25, 40], precipRange: [1, 100], cloudRange: [30, 100] },
  { id: "warm-dry", name: "Warm & Dry", tempRange: [15, 25], precipRange: [0, 1], cloudRange: [0, 30] },
  { id: "warm-wet", name: "Warm & Wet", tempRange: [15, 25], precipRange: [1, 100], cloudRange: [30, 100] },
  { id: "cool-dry", name: "Cool & Dry", tempRange: [5, 15], precipRange: [0, 1], cloudRange: [0, 30] },
  { id: "cool-wet", name: "Cool & Wet", tempRange: [5, 15], precipRange: [1, 100], cloudRange: [30, 100] },
  { id: "cold-dry", name: "Cold & Dry", tempRange: [-10, 5], precipRange: [0, 1], cloudRange: [0, 30] },
  { id: "cold-wet", name: "Cold & Wet", tempRange: [-10, 5], precipRange: [1, 100], cloudRange: [30, 100] },
]

/**
 * Determines the weather state for a given weather data point
 */
export function getWeatherState(data: WeatherData): WeatherState {
  const { mean_temp, precipitation, cloud_cover } = data

  for (const state of weatherStates) {
    const [minTemp, maxTemp] = state.tempRange
    const [minPrecip, maxPrecip] = state.precipRange
    const [minCloud, maxCloud] = state.cloudRange

    if (
      mean_temp >= minTemp &&
      mean_temp < maxTemp &&
      precipitation >= minPrecip &&
      precipitation < maxPrecip &&
      cloud_cover >= minCloud &&
      cloud_cover < maxCloud
    ) {
      return state
    }
  }

  // Default to cool-wet if no match is found
  return weatherStates[5]
}

/**
 * Builds a transition matrix from historical weather data
 */
export function buildTransitionMatrix(data: WeatherData[]): number[][] {
  const numStates = weatherStates.length
  const counts = Array(numStates)
    .fill(0)
    .map(() => Array(numStates).fill(0))
  const totals = Array(numStates).fill(0)

  // Count transitions between states
  for (let i = 0; i < data.length - 1; i++) {
    const currentState = getWeatherState(data[i])
    const nextState = getWeatherState(data[i + 1])

    const currentIdx = weatherStates.findIndex((s) => s.id === currentState.id)
    const nextIdx = weatherStates.findIndex((s) => s.id === nextState.id)

    counts[currentIdx][nextIdx]++
    totals[currentIdx]++
  }

  // Calculate probabilities
  const matrix = Array(numStates)
    .fill(0)
    .map(() => Array(numStates).fill(0))

  for (let i = 0; i < numStates; i++) {
    for (let j = 0; j < numStates; j++) {
      matrix[i][j] = totals[i] > 0 ? counts[i][j] / totals[i] : 0
    }
  }

  return matrix
}

/**
 * Predicts the next weather state based on the current state and transition matrix
 */
export function predictNextState(currentStateIdx: number, transitionMatrix: number[][]): number {
  const probabilities = transitionMatrix[currentStateIdx]
  const random = Math.random()
  let cumulativeProbability = 0

  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i]
    if (random < cumulativeProbability) {
      return i
    }
  }

  // Default to the last state if something goes wrong
  return probabilities.length - 1
}

/**
 * Predicts weather states for a number of days ahead
 */
export function predictWeatherStates(currentStateIdx: number, transitionMatrix: number[][], days: number): number[] {
  const predictions = [currentStateIdx]
  let currentIdx = currentStateIdx

  for (let i = 0; i < days; i++) {
    currentIdx = predictNextState(currentIdx, transitionMatrix)
    predictions.push(currentIdx)
  }

  return predictions
}

/**
 * Generates sample weather data based on a weather state
 */
export function generateWeatherData(stateIdx: number): Partial<WeatherData> {
  const state = weatherStates[stateIdx]
  const [minTemp, maxTemp] = state.tempRange
  const [minPrecip, maxPrecip] = state.precipRange
  const [minCloud, maxCloud] = state.cloudRange

  // Generate random values within the state's ranges
  const mean_temp = minTemp + Math.random() * (maxTemp - minTemp)
  const precipitation = minPrecip + Math.random() * (maxPrecip - minPrecip)
  const cloud_cover = minCloud + Math.random() * (maxCloud - minCloud)

  // Calculate related values
  const max_temp = mean_temp + 2 + Math.random() * 3
  const min_temp = mean_temp - 2 - Math.random() * 3
  const sunshine = Math.max(0, 12 * (1 - cloud_cover / 100))
  const pressure = 1013 + (Math.random() * 10 - 5)

  return {
    mean_temp,
    max_temp,
    min_temp,
    precipitation,
    cloud_cover,
    sunshine,
    pressure,
    snow_depth: mean_temp < 0 && precipitation > 0 ? precipitation / 10 : 0,
  }
}

/**
 * Predicts weather data for a number of days ahead
 */
export function predictWeatherData(
  currentData: WeatherData,
  historicalData: WeatherData[],
  days: number,
): Partial<WeatherData>[] {
  // Build transition matrix from historical data
  const transitionMatrix = buildTransitionMatrix(historicalData)

  // Get current weather state
  const currentState = getWeatherState(currentData)
  const currentStateIdx = weatherStates.findIndex((s) => s.id === currentState.id)

  // Predict future states
  const stateIndices = predictWeatherStates(currentStateIdx, transitionMatrix, days)

  // Generate weather data for each predicted state
  return stateIndices.map((idx) => generateWeatherData(idx))
}
