'use client'

import React, { useState, useEffect } from 'react'
import { useStock } from '@/context/StockContext'

interface StockQuoteCardProps {
  symbol?: string
  className?: string
}

interface QuoteData {
  currentPrice: number
  change: number
  percentChange: number
  high: number
  low: number
  open: number
  previousClose: number
}

export const StockQuoteCard: React.FC<StockQuoteCardProps> = ({
  symbol: propSymbol,
  className = '',
}) => {
  const stockContext = useStock()
  const activeSymbol = propSymbol || stockContext?.selectedSymbol || 'AAPL'

  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!activeSymbol) return

    let isMounted = true
    setLoading(true)
    setError(null)

    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(activeSymbol)}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = await res.json()
        if (json.success && json.data) {
          if (isMounted) setQuote(json.data)
        } else {
          throw new Error(json.error || 'Failed to parse quote response')
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error loading stock quote')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchQuote()

    return () => {
      isMounted = false
    }
  }, [activeSymbol])

  if (loading) {
    return (
      <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl animate-pulse space-y-4 ${className}`}>
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-10 bg-slate-700 rounded w-1/2"></div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center text-slate-400 text-xs ${className}`}>
        ไม่สามารถโหลดราคาตลาดสำหรับ {activeSymbol} ({error || 'ไม่มีข้อมูล'})
      </div>
    )
  }

  const isPositive = quote.change >= 0
  const colorClass = isPositive ? 'text-emerald-400' : 'text-rose-400'
  const bgBadgeClass = isPositive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
  const sign = isPositive ? '+' : ''

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5 ${className}`}>
      {/* Header: Symbol & Price */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-extrabold rounded">
            {activeSymbol.toUpperCase()}
          </span>
          <p className="text-xs text-slate-400 mt-1">ราคาตลาดสด (Real-time Market Quote)</p>
        </div>
        <div className={`px-2.5 py-1 border rounded-lg font-mono text-xs font-bold ${bgBadgeClass}`}>
          {sign}{quote.change.toFixed(2)} ({sign}{quote.percentChange.toFixed(2)}%)
        </div>
      </div>

      <div>
        <span className="text-3xl font-extrabold text-white tracking-tight">
          ${quote.currentPrice.toFixed(2)}
        </span>
        <span className={`ml-2 text-sm font-semibold ${colorClass}`}>
          USD
        </span>
      </div>

      {/* Metric Grid */}
      <div className="pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-slate-400 font-medium">ราคาเปิด (Open)</p>
          <p className="text-sm font-bold text-slate-100 mt-0.5">${quote.open.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">ราคาสูงสุด (High)</p>
          <p className="text-sm font-bold text-emerald-400 mt-0.5">${quote.high.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">ราคาต่ำสุด (Low)</p>
          <p className="text-sm font-bold text-rose-400 mt-0.5">${quote.low.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">ราคาปิดวันก่อน (Prev Close)</p>
          <p className="text-sm font-bold text-slate-100 mt-0.5">${quote.previousClose.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
