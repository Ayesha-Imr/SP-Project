"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function MarkovStateGraph() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Define the graph data
    const nodes = [
      { id: "Sunny", group: 1 },
      { id: "Partly Cloudy", group: 2 },
      { id: "Cloudy", group: 2 },
      { id: "Light Rain", group: 3 },
      { id: "Heavy Rain", group: 3 },
    ]

    const links = [
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

    // Get the dimensions of the container
    const containerWidth = svgRef.current.clientWidth
    const containerHeight = svgRef.current.clientHeight

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
  }, [])

  return <svg ref={svgRef} className="w-full h-full" />
}
