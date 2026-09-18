'use client'

import React, { useState, useMemo } from 'react'
import { useStock } from '@/context/StockContext'

interface StockChartProps {
  symbol?: string
  className?: string
}

type Timeframe = '1D' | '1W' | '1M' | '1Y'

interface PricePoint {
  time: string
  price: number
  high: number
  low: number
  volume: number
}

// Generate realistic mock historical price data based on timeframe & symbol
function generateChartData(symbol: string, timeframe: Timeframe): PricePoint[] {
  const pointsCount = timeframe === '1D' ? 24 : timeframe === '1W' ? 35 : timeframe === '1M' ? 30 : 52
  const basePrice = symbol === 'NVDA' ? 125 : symbol === 'TSLA' ? 240 : symbol === 'MSFT' ? 415 : 225
  const points: PricePoint[] = []

  let currentPrice = basePrice
  const now = new Date()

  for (let i = pointsCount; i >= 0; i--) {
    const delta = (Math.random() - 0.48) * (basePrice * 0.02)
    currentPrice = Math.max(10, currentPrice + delta)
    const high = currentPrice + Math.random() * (basePrice * 0.01)
    const low = currentPrice - Math.random() * (basePrice * 0.01)
    const volume = Math.floor(Math.random() * 5000000) + 1000000

    let timeLabel = ''
    if (timeframe === '1D') {
      const d = new Date(now.getTime() - i * 3600 * 1000)
      timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (timeframe === '1W') {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000)
      timeLabel = d.toLocaleDateString([], { weekday: 'short' })
    } else if (timeframe === '1M') {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000)
      timeLabel = `${d.getDate()}/${d.getMonth() + 1}`
    } else {
      const d = new Date(now.getTime() - i * 7 * 24 * 3600 * 1000)
      timeLabel = `W${Math.floor(i / 4) + 1}`
    }

    points.push({
      time: timeLabel,
      price: parseFloat(currentPrice.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume,
    })
  }

  return points
}

export const StockChart: React.FC<StockChartProps> = ({
  symbol: propSymbol,
  className = '',
}) => {
  const stockContext = useStock()
  const activeSymbol = (propSymbol || stockContext?.selectedSymbol || 'AAPL').toUpperCase()

  const [timeframe, setTimeframe] = useState<Timeframe>('1M')
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null)

  const chartData = useMemo(() => generateChartData(activeSymbol, timeframe), [activeSymbol, timeframe])

  const minPrice = useMemo(() => Math.min(...chartData.map((d) => d.low)), [chartData])
  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.high)), [chartData])
  const priceRange = maxPrice - minPrice || 1

  const firstPrice = chartData[0]?.price || 0
  const lastPrice = chartData[chartData.length - 1]?.price || 0
  const isPositive = lastPrice >= firstPrice
  const priceChange = lastPrice - firstPrice
  const percentChange = firstPrice ? (priceChange / firstPrice) * 100 : 0

  // Generate SVG path coordinates
  const svgWidth = 600
  const svgHeight = 220
  const padding = 20

  const pointsString = useMemo(() => {
    return chartData
      .map((d, index) => {
        const x = padding + (index / (chartData.length - 1)) * (svgWidth - padding * 2)
        const y = svgHeight - padding - ((d.price - minPrice) / priceRange) * (svgHeight - padding * 2)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }, [chartData, minPrice, priceRange])

  const areaString = useMemo(() => {
    if (!chartData.length) return ''
    const firstX = padding
    const lastX = svgWidth - padding
    const bottomY = svgHeight - padding
    return `${firstX},${bottomY} ${pointsString} ${lastX},${bottomY}`
  }, [chartData, pointsString])

  const activePoint = hoveredPoint || chartData[chartData.length - 1]

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5 ${className}`}>
      {/* Header: Title, Price, Timeframe selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-extrabold rounded">
              {activeSymbol}
            </span>
            <h3 className="text-base font-bold text-white">กราฟราคาประวัติศาสตร์ (Price Chart)</h3>
          </div>

          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-white">
              ${activePoint ? activePoint.price.toFixed(2) : lastPrice.toFixed(2)}
            </span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
            {hoveredPoint && (
              <span className="text-xs text-slate-400 font-medium">
                เวลา: {hoveredPoint.time}
              </span>
            )}
          </div>
        </div>

        {/* Timeframe Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          {(['1D', '1W', '1M', '1Y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                timeframe === tf
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Financial Chart */}
      <div className="relative w-full overflow-hidden bg-slate-900/40 rounded-xl border border-slate-700/40 p-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56 overflow-visible">
          <defs>
            <linearGradient id="gradientPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={svgHeight * ratio}
              x2={svgWidth - padding}
              y2={svgHeight * ratio}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="0.8"
            />
          ))}

          {/* Area Fill */}
          <polygon
            points={areaString}
            fill={isPositive ? 'url(#gradientPositive)' : 'url(#gradientNegative)'}
          />

          {/* Line Chart */}
          <polyline
            fill="none"
            stroke={isPositive ? '#10b981' : '#f43f5e'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Hover interactive points */}
          {chartData.map((d, index) => {
            const x = padding + (index / (chartData.length - 1)) * (svgWidth - padding * 2)
            const y = svgHeight - padding - ((d.price - minPrice) / priceRange) * (svgHeight - padding * 2)
            const isHovered = hoveredPoint?.time === d.time

            return (
              <g key={index} onMouseEnter={() => setHoveredPoint(d)} onMouseLeave={() => setHoveredPoint(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3}
                  className={`transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? isPositive ? 'fill-emerald-400 stroke-white stroke-2' : 'fill-rose-400 stroke-white stroke-2'
                      : 'fill-transparent hover:fill-indigo-400'
                  }`}
                />
              </g>
            )
          })}
        </svg>

        {/* X-Axis Time Labels */}
        <div className="flex justify-between items-center px-4 pt-2 text-[10px] text-slate-400 font-mono">
          <span>{chartData[0]?.time}</span>
          <span>{chartData[Math.floor(chartData.length / 2)]?.time}</span>
          <span>{chartData[chartData.length - 1]?.time}</span>
        </div>
      </div>
    </div>
  )
}
