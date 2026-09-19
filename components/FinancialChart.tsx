'use client'

import React from 'react'

interface FinancialChartProps {
  data: Array<{ year: number | string; revenue: number | null; netIncome: number | null }>
  className?: string
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ data, className = '' }) => {
  if (!data || data.length === 0) return null

  const validRevenues = data.map((d) => d.revenue || 0)
  const maxRevenue = Math.max(...validRevenues, 1)

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          📊 แนวโน้มรายได้และกำไรสุทธิ (Revenue & Net Income Trend)
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">หน่วย: ล้านดอลลาร์ ($M)</span>
      </div>

      <div className="space-y-3 pt-2">
        {data.map((item) => {
          const revM = (item.revenue || 0) / 1e6
          const netM = (item.netIncome || 0) / 1e6
          const revWidthPercent = Math.min(100, Math.max(5, ((item.revenue || 0) / maxRevenue) * 100))

          return (
            <div key={item.year} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{item.year}</span>
                <span className="font-mono text-emerald-400">
                  รายได้: ${revM.toFixed(1)}M | กำไร: ${netM.toFixed(1)}M
                </span>
              </div>
              <div className="w-full bg-slate-900/60 rounded-full h-3 overflow-hidden p-0.5 flex items-center">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${revWidthPercent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
