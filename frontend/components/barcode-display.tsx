"use client"

import { useEffect, useRef } from "react"

interface BarcodeDisplayProps {
  code: string
}

export function BarcodeDisplay({ code }: BarcodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple barcode visualization
    const barWidth = 3
    const barHeight = 100
    const spacing = 2
    const totalWidth = code.length * (barWidth + spacing)

    canvas.width = totalWidth
    canvas.height = barHeight + 40

    // Draw bars
    ctx.fillStyle = "#000000"
    code.split("").forEach((char, index) => {
      const height = char === "1" ? barHeight : barHeight * 0.6
      const x = index * (barWidth + spacing)
      const y = (barHeight - height) / 2
      ctx.fillRect(x, y, barWidth, height)
    })

    // Draw code text
    ctx.font = "14px monospace"
    ctx.textAlign = "center"
    ctx.fillText(code, totalWidth / 2, barHeight + 30)
  }, [code])

  return <canvas ref={canvasRef} className="mx-auto" />
}
