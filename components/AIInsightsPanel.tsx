'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useStock } from '@/context/StockContext'

interface AIInsightsData {
  symbol: string
  summary: string
  marketTrends: string[]
  riskAssessment: string[]
  keyHighlights: string[]
}

interface AIInsightsPanelProps {
  symbol?: string
  className?: string
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  symbol: propSymbol,
  className = '',
}) => {
  const stockContext = useStock()
  const activeSymbol = propSymbol || stockContext?.selectedSymbol || 'AAPL'

  const [insights, setInsights] = useState<AIInsightsData | null>(null)
  const [source, setSource] = useState<string>('ai')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    if (!activeSymbol) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/ai-insights?symbol=${encodeURIComponent(activeSymbol)}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ไม่สามารถดึงข้อมูลรายงาน AI ได้`)
      }
      const json = await res.json()
      if (json.success && json.data) {
        setInsights(json.data)
        setSource(json.source || 'gemini')
      } else {
        throw new Error(json.error || 'Failed to fetch AI insights')
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดบทวิเคราะห์ AI')
    } finally {
      setLoading(false)
    }
  }, [activeSymbol])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  if (loading) {
    return (
      <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl animate-pulse space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-1/6"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="h-24 bg-slate-700/60 rounded-xl"></div>
          <div className="h-24 bg-slate-700/60 rounded-xl"></div>
          <div className="h-24 bg-slate-700/60 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-3 ${className}`}>
        <div className="text-xl">⚠️</div>
        <p className="text-sm font-semibold text-slate-200">
          ไม่สามารถโหลดข้อมูลวิเคราะห์ AI สำหรับ {activeSymbol}
        </p>
        <p className="text-xs text-rose-400 font-mono">
          {error || 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบประมวลผล'}
        </p>
        <button
          type="button"
          onClick={fetchInsights}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-colors shadow-md mt-2"
        >
          🔄 ลองใหม่อีกครั้ง (Retry)
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 text-lg">
            🤖
          </span>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Gemini AI Insights ({insights.symbol})
            </h3>
            <p className="text-xs text-slate-400">การวิเคราะห์สภาวะตลาด ปัจจัยเสี่ยง และไฮไลท์โดย Google Gen AI</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {source === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'AI Engine'}
        </span>
      </div>

      {/* Summary Banner */}
      <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 font-medium leading-relaxed">
        💡 {insights.summary}
      </div>

      {/* 3 Sections: Market Trends, Key Highlights, Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Market Trends */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-2">
          <h4 className="font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            📈 แนวโน้มตลาด (Market Trends)
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {insights.marketTrends.map((trend, idx) => (
              <li key={idx} className="leading-relaxed">{trend}</li>
            ))}
          </ul>
        </div>

        {/* Key Highlights */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-2">
          <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            ⭐ ไฮไลท์สำคัญ (Key Highlights)
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {insights.keyHighlights.map((highlight, idx) => (
              <li key={idx} className="leading-relaxed">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Risk Assessment */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-2">
          <h4 className="font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            ⚠️ ประเมินความเสี่ยง (Risk Assessment)
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {insights.riskAssessment.map((risk, idx) => (
              <li key={idx} className="leading-relaxed">{risk}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
