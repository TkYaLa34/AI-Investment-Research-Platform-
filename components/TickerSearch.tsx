'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FinnhubSearchResult } from '@/lib/finnhub'

interface TickerSearchProps {
  className?: string
  placeholder?: string
}

// Popular/trending suggestions when search input is focused and empty
const TRENDING_SUGGESTIONS: FinnhubSearchResult[] = [
  { symbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' },
  { symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' },
  { symbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Common Stock' },
  { symbol: 'TSLA', description: 'Tesla Inc.', type: 'Common Stock' },
  { symbol: 'SPY', description: 'SPDR S&P 500 ETF Trust', type: 'ETP' },
]

export const TickerSearch: React.FC<TickerSearchProps> = ({
  className = '',
  placeholder = 'ค้นหาชื่อย่อหุ้นหรือชื่อบริษัท (เช่น AAPL, NVDA)...',
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FinnhubSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [recentSearches, setRecentSearches] = useState<FinnhubSearchResult[]>([])
  const [hoveredPreviewItem, setHoveredPreviewItem] = useState<FinnhubSearchResult | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Load search history from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('investradar_search_history')
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load search history:', e)
    }
  }, [])

  const saveToHistory = (item: FinnhubSearchResult) => {
    try {
      const filtered = recentSearches.filter((s) => s.symbol !== item.symbol)
      const updated = [item, ...filtered].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('investradar_search_history', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save search history:', e)
    }
  }

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches([])
    try {
      localStorage.removeItem('investradar_search_history')
    } catch (e) {
      console.error('Failed to clear search history:', e)
    }
  }

  // Debounced API search execution
  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const json = await res.json()
        setResults(json.data || [])
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchResults(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, fetchSearchResults])

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayedList = query.trim() ? results : TRENDING_SUGGESTIONS

  const handleSelectResult = (item: FinnhubSearchResult) => {
    saveToHistory(item)
    setIsOpen(false)
    setQuery('')
    router.push(`/company/${item.symbol.toLowerCase()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < displayedList.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayedList.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < displayedList.length) {
        handleSelectResult(displayedList[selectedIndex])
      } else if (query.trim()) {
        router.push(`/company/${query.trim().toLowerCase()}`)
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          🔍
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-md"
        />
        {loading ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Results Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-800/95 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-md max-h-[420px] overflow-y-auto divide-y divide-slate-700/50 flex flex-col md:flex-row">
          <div className="flex-1">
            {/* Recent Search History Section */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="border-b border-slate-700/50">
                <div className="px-4 py-2 bg-slate-900/80 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>🕒 ประวัติการค้นหาล่าสุด</span>
                  <button
                    onClick={clearHistory}
                    className="text-[10px] text-slate-400 hover:text-red-400 transition-colors lowercase"
                  >
                    ล้างประวัติ
                  </button>
                </div>
                {recentSearches.map((item, idx) => (
                  <div
                    key={`history-${item.symbol}-${idx}`}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => {
                      setSelectedIndex(-1)
                      setHoveredPreviewItem(item)
                    }}
                    className="px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-slate-700/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 font-mono text-[11px] font-semibold rounded">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                        {item.description}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">ล่าสุด</span>
                  </div>
                ))}
              </div>
            )}

            {/* Header for Trending or Results */}
            {!query.trim() && (
              <div className="px-4 py-2 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                🔥 หุ้นและ ETF ยอดนิยม
              </div>
            )}

            {displayedList.length === 0 ? (
              <div className="px-4 py-6 text-center text-slate-400 text-xs">
                ไม่พบข้อมูลหุ้นสำหรับ &quot;{query}&quot;
              </div>
            ) : (
              displayedList.map((item, index) => {
                const isSelected = index === selectedIndex
                return (
                  <div
                    key={`${item.symbol}-${index}`}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => {
                      setSelectedIndex(index)
                      setHoveredPreviewItem(item)
                    }}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-indigo-600/30 border-l-4 border-indigo-500 text-white' : 'hover:bg-slate-700/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded">
                        {item.symbol}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-white leading-tight">{item.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400">
                      ดูข้อมูล →
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Instant Preview Card Panel */}
          {hoveredPreviewItem && (
            <div className="w-full md:w-64 bg-slate-900/90 border-t md:border-t-0 md:border-l border-slate-700/80 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold rounded">
                    {hoveredPreviewItem.symbol}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                    {hoveredPreviewItem.type || 'Stock'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-3 line-clamp-2">
                  {hoveredPreviewItem.description}
                </h4>

                <div className="space-y-2 py-2 border-y border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">ราคาปัจจุบัน</span>
                    <span className="font-mono font-bold text-white">
                      ${hoveredPreviewItem.currentPrice?.toFixed(2) || '180.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">การเปลี่ยนแปลง</span>
                    <span
                      className={`font-mono font-bold ${
                        (hoveredPreviewItem.changePercent || 0) >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {(hoveredPreviewItem.changePercent || 0) >= 0 ? '+' : ''}
                      {hoveredPreviewItem.changePercent?.toFixed(2) || '0.00'}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">มูลค่าตลาด</span>
                    <span className="font-mono text-slate-200">
                      {hoveredPreviewItem.marketCap || '$100B'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSelectResult(hoveredPreviewItem)}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md text-center block"
                >
                  🔍 ดูวิเคราะห์เต็ม
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
