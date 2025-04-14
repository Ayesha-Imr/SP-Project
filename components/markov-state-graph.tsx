"use client"

import { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import type { WeatherData } from "@/lib/markov-chain"
import { buildTransitionMatrix, weatherStates } from "@/lib/markov-chain"

export function MarkovStateGraph() {
  const svgRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDataAndRender() {
      try {
        setLoading(true)
        
        // Fetch weather data from API
        const response = await fetch("/api/weather-data")
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        
        const result = await response.json()
        const weatherData: WeatherData[] = result.data
        
        // Generate graph data from weather data or use defaults
        const graphData = weatherData.length > 0 
          ? generateGraphDataFromWeatherData(weatherData)
          : getDefaultGraphData()
          
        // Render the graph
        renderGraph(graphData.nodes, graphData.links)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load state graph data")
        // Render with default data on error
        const defaultData = getDefaultGraphData()
        renderGraph(defaultData.nodes, defaultData.links)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDataAndRender()
  }, [])
  
  // Transform weather data into graph nodes and links
  function generateGraphDataFromWeatherData(weatherData: WeatherData[]) {
    // Define the simplified display nodes
    const nodes = [
      { id: "Sunny", group: 1 },
      { id: "Partly Cloudy", group: 2 },
      { id: "Cloudy", group: 2 },
      { id: "Light Rain", group: 3 },
      { id: "Heavy Rain", group: 3 },
    ]
    
    // Build full transition matrix from data
    const fullMatrix = buildTransitionMatrix(weatherData)
    
    // Mapping of internal state IDs to display states
    const stateMapping: {[key: string]: number} = {
      'hot-dry': 0,
      'warm-dry': 0,
      'hot-wet': 1,
      'warm-wet': 1,
      'cool-dry': 2,
      'cool-wet': 3,
      'cold-dry': 2,
      'cold-wet': 4
    }
    
    // Simplify the transition matrix to 5x5
    const simplifiedMatrix = Array(5).fill(0).map(() => Array(5).fill(0))
    const stateCounts = Array(5).fill(0)
    
    // For each weather state in the full matrix
    for (let fromIdx = 0; fromIdx < weatherStates.length; fromIdx++) {
      const fromDisplayIdx = stateMapping[weatherStates[fromIdx].id]
      
      for (let toIdx = 0; toIdx < weatherStates.length; toIdx++) {
        const toDisplayIdx = stateMapping[weatherStates[toIdx].id] 
        
        // Add probability to the simplified matrix
        simplifiedMatrix[fromDisplayIdx][toDisplayIdx] += fullMatrix[fromIdx][toIdx]
      }
      
      stateCounts[fromDisplayIdx]++
    }
    
    // Normalize the matrix so each row sums to 1
    for (let i = 0; i < 5; i++) {
      const rowSum = simplifiedMatrix[i].reduce((a, b) => a + b, 0)
      if (rowSum > 0) {
        for (let j = 0; j < 5; j++) {
          simplifiedMatrix[i][j] /= rowSum
        }
      } else {
        // If a state doesn't exist in the data, use default probabilities
        const defaultLinks = getDefaultLinks()
        const rowLinks = defaultLinks.filter(link => link.source === nodes[i].id)
        for (let j = 0; j < 5; j++) {
          const link = rowLinks.find(link => link.target === nodes[j].id)
          simplifiedMatrix[i][j] = link ? link.value : 0
        }
      }
    }
    
    // Create links from the simplified matrix
    const links = []
    const displayStateNames = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain"]
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (simplifiedMatrix[i][j] > 0) {
          links.push({
            source: displayStateNames[i],
            target: displayStateNames[j],
            value: simplifiedMatrix[i][j]
          })
        }
      }
    }
    
    return { nodes, links }
  }
  
  // Default graph data
  function getDefaultGraphData() {
    return {
      nodes: [
        { id: "Sunny", group: 1 },
        { id: "Partly Cloudy", group: 2 },
        { id: "Cloudy", group: 2 },
        { id: "Light Rain", group: 3 },
        { id: "Heavy Rain", group: 3 },
      ],
      links: getDefaultLinks()
    }
  }
  
  // Default link data
  function getDefaultLinks() {
    return [
      { source: "Sunny", target: "Sunny", value: 0.65 },
      { source: "Sunny", target: "Partly Cloudy", value: 0.2 },
      { source: "Sunny", target: "Cloudy", value: 0.1 },
      { source: "Sunny", target: "Light Rain", value: 0.04 },
      { source: "Sunny", target: "Heavy Rain", value: 0.01 },

      { source: "Partly Cloudy", target: "Sunny", value: 0.25 },
      { source: "Partly Cloudy", target: "Partly Cloudy", value: 0.45 },
      { source: "Partly Cloudy", target: "Cloudy", value: 0.2 },
      { source: "Partly Cloudy", target: "Light Rain", value: 0.08 },
      { source: "Partly Cloudy", target: "Heavy Rain", value: 0.02 },

      { source: "Cloudy", target: "Sunny", value: 0.1 },
      { source: "Cloudy", target: "Partly Cloudy", value: 0.25 },
      { source: "Cloudy", target: "Cloudy", value: 0.4 },
      { source: "Cloudy", target: "Light Rain", value: 0.2 },
      { source: "Cloudy", target: "Heavy Rain", value: 0.05 },

      { source: "Light Rain", target: "Sunny", value: 0.05 },
      { source: "Light Rain", target: "Partly Cloudy", value: 0.15 },
      { source: "Light Rain", target: "Cloudy", value: 0.3 },
      { source: "Light Rain", target: "Light Rain", value: 0.4 },
      { source: "Light Rain", target: "Heavy Rain", value: 0.1 },

      { source: "Heavy Rain", target: "Sunny", value: 0.01 },
      { source: "Heavy Rain", target: "Partly Cloudy", value: 0.09 },
      { source: "Heavy Rain", target: "Cloudy", value: 0.25 },
      { source: "Heavy Rain", target: "Light Rain", value: 0.35 },
      { source: "Heavy Rain", target: "Heavy Rain", value: 0.3 },
    ]
  }

  // Render D3 graph with provided nodes and links
  function renderGraph(nodes, links) {
    if (!svgRef.current) return

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Get the dimensions of the container
    const containerWidth = svgRef.current.clientWidth || 600
    const containerHeight = svgRef.current.clientHeight || 400

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", [0, 0, containerWidth, containerHeight])
      .attr("style", "max-width: 100%; height: auto;")

    // Create a force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))

    // Create the links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        const value = d.value
        return d3.interpolateBlues(value * 2)
      })
      .attr("stroke-width", (d) => Math.max(1, d.value * 5))
      .attr("stroke-opacity", 0.6)

    // Create the nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", (d) => {
        if (d.group === 1) return "#fde68a" // Sunny - yellow
        if (d.group === 2) return "#93c5fd" // Cloudy - blue
        return "#60a5fa" // Rainy - darker blue
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(drag(simulation))

    // Add labels to the nodes
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .text((d) => d.id)
      .attr("font-size", "10px")
      .attr("pointer-events", "none")

    // Update the positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node
        .attr("cx", (d) => (d.x = Math.max(20, Math.min(containerWidth - 20, d.x))))
        .attr("cy", (d) => (d.y = Math.max(20, Math.min(containerHeight - 20, d.y))))

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y)
    })

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading state graph data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return <svg ref={svgRef} className="w-full h-full" />
}
