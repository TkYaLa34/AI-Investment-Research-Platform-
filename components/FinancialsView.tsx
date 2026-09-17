'use client'

import React, { useState, useEffect } from 'react'
import { useStock } from '@/context/StockContext'
import type { FinancialsData } from '@/lib/financials'

interface FinancialsViewProps {
  symbol?: string
  className?: string
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  symbol: propSymbol,
  className = '',
}) => {
  const stockContext = useStock()
  const activeSymbol = (propSymbol || stockContext?.selectedSymbol || 'AAPL').toUpperCase()

  const [data, setData] = useState<FinancialsData | null>(null)
  const [activeTab, setActiveTab] = useState<'income' | 'cashflow' | 'balance' | 'sec'>('income')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!activeSymbol) return

    let isMounted = true
    setLoading(true)
    setError(null)

    const fetchFinancials = async () => {
      try {
        const res = await fetch(`/api/financials?symbol=${encodeURIComponent(activeSymbol)}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = await res.json()
        if (json.success && json.data) {
          if (isMounted) setData(json.data)
        } else {
          throw new Error(json.error || 'Failed to parse financials response')
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error loading financial statements')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFinancials()

    return () => {
      isMounted = false
    }
  }, [activeSymbol])

  if (loading) {
    return (
      <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl animate-pulse space-y-4 ${className}`}>
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-32 bg-slate-700/60 rounded-xl pt-4"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center text-slate-400 text-xs ${className}`}>
        ไม่สามารถโหลดงบการเงินสำหรับ {activeSymbol} ({error || 'ไม่มีข้อมูล'})
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6 ${className}`}>
      {/* Header & SEC Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-extrabold rounded">
              {data.ticker}
            </span>
            <h3 className="text-base font-bold text-white">งบการเงิน & SEC Filings (10-K / 10-Q)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {data.entityName} {data.cik ? `• SEC CIK: ${data.cik}` : ''}
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'income' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 งบกำไรขาดทุน
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cashflow')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cashflow' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            💵 กระแสเงินสด
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'balance' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ งบดุล
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sec')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sec' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📑 เอกสาร SEC
          </button>
        </div>
      </div>

      {/* Financial Statement Tables */}
      {activeTab !== 'sec' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-700/60">
              <tr>
                <th scope="col" className="px-4 py-3">ปีงบการเงิน (Fiscal Year)</th>
                {activeTab === 'income' && (
                  <>
                    <th scope="col" className="px-4 py-3">รายได้รวม (Revenue $M)</th>
                    <th scope="col" className="px-4 py-3">กำไรสุทธิ (Net Income $M)</th>
                    <th scope="col" className="px-4 py-3">อัตรากำไร (Net Margin %)</th>
                  </>
                )}
                {activeTab === 'cashflow' && (
                  <>
                    <th scope="col" className="px-4 py-3">กระแสเงินสดจากการดำเนินงาน ($M)</th>
                    <th scope="col" className="px-4 py-3">กระแสเงินสดอิสระ (Free Cash Flow $M)</th>
                    <th scope="col" className="px-4 py-3">FCF / Revenue %</th>
                  </>
                )}
                {activeTab === 'balance' && (
                  <>
                    <th scope="col" className="px-4 py-3">สินทรัพย์รวม (Total Assets $M)</th>
                    <th scope="col" className="px-4 py-3">หนี้สินรวม (Total Debt $M)</th>
                    <th scope="col" className="px-4 py-3">อัตราส่วนหนี้สิน (Debt Ratio %)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-mono">
              {data.fundamentals.map((f) => {
                const netMargin = ((f.netIncome / f.revenue) * 100).toFixed(1)
                const fcfMargin = ((f.freeCashFlow / f.revenue) * 100).toFixed(1)
                const debtRatio = ((f.totalDebt / f.totalAssets) * 100).toFixed(1)

                return (
                  <tr key={f.year} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-300">{f.year}</td>
                    {activeTab === 'income' && (
                      <>
                        <td className="px-4 py-3 font-semibold text-white">${f.revenue.toLocaleString()}M</td>
                        <td className="px-4 py-3 font-semibold text-emerald-400">${f.netIncome.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-slate-200">{netMargin}%</td>
                      </>
                    )}
                    {activeTab === 'cashflow' && (
                      <>
                        <td className="px-4 py-3 font-semibold text-white">${f.operatingCashFlow.toLocaleString()}M</td>
                        <td className="px-4 py-3 font-semibold text-emerald-400">${f.freeCashFlow.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-slate-200">{fcfMargin}%</td>
                      </>
                    )}
                    {activeTab === 'balance' && (
                      <>
                        <td className="px-4 py-3 font-semibold text-white">${f.totalAssets.toLocaleString()}M</td>
                        <td className="px-4 py-3 font-semibold text-rose-400">${f.totalDebt.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-slate-200">{debtRatio}%</td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* SEC Filings List */
        <div className="space-y-3">
          {data.recentFilings.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              ไม่พบเอกสารยื่น SEC ล่าสุดสำหรับ {data.ticker}
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50 bg-slate-900/40 rounded-xl border border-slate-700/60 overflow-hidden">
              {data.recentFilings.map((filing, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      filing.form === '10-K' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {filing.form}
                    </span>
                    <div>
                      <p className="font-semibold text-white leading-snug">{filing.primaryDocDescription}</p>
                      <p className="text-[10px] text-slate-400">วันที่ยื่น: {filing.filingDate} • Accession: {filing.accessionNumber}</p>
                    </div>
                  </div>
                  {filing.documentUrl ? (
                    <a
                      href={filing.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline shrink-0 ml-2"
                    >
                      อ่านเอกสาร SEC ↗
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">{filing.accessionNumber}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
