'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FinnhubSearchResult } from '@/lib/finnhub'

interface TickerSearchProps {
  className?: string
  placeholder?: string
}

const STORAGE_KEY = 'investradar_search_history'

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
  const [hoveredItem, setHoveredItem] = useState<FinnhubSearchResult | null>(null)
  const [searchHistory, setSearchHistory] = useState<FinnhubSearchResult[]>([])
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage on client side mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to parse search history from localStorage:', e)
    }
  }, [])

  // Save item to history (up to 5 items max)
  const addToHistory = (item: FinnhubSearchResult) => {
    try {
      setSearchHistory((prev) => {
        const filtered = prev.filter(
          (h) => h.symbol.toUpperCase() !== item.symbol.toUpperCase()
        )
        const updated = [item, ...filtered].slice(0, 5)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch (err) {
          console.error('Failed to save search history to localStorage:', err)
        }
        return updated
      })
    } catch (e) {
      console.error('Failed to save search history:', e)
    }
  }

  // Clear all search history
  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear search history from localStorage:', e)
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

  const displayedList = query.trim() ? results : (searchHistory.length > 0 ? searchHistory : TRENDING_SUGGESTIONS)

  const handleSelectResult = (item: FinnhubSearchResult) => {
    addToHistory(item)
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
      setSelectedIndex((prev) => {
        const next = prev < displayedList.length - 1 ? prev + 1 : 0
        setHoveredItem(displayedList[next] || null)
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : displayedList.length - 1
        setHoveredItem(displayedList[next] || null)
        return next
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < displayedList.length) {
        handleSelectResult(displayedList[selectedIndex])
      } else if (query.trim()) {
        const customItem: FinnhubSearchResult = {
          symbol: query.trim().toUpperCase(),
          description: query.trim().toUpperCase(),
          type: 'Common Stock'
        }
        handleSelectResult(customItem)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
      setHoveredItem(null)
    }
  }

  const activePreviewItem = hoveredItem || (selectedIndex >= 0 && selectedIndex < displayedList.length ? displayedList[selectedIndex] : null)

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
            setHoveredItem(null)
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
              setHoveredItem(null)
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute left-0 w-full min-w-[320px] sm:min-w-[400px] mt-2 z-50 bg-slate-800/95 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md divide-y divide-slate-700/50">
          {/* Header section for search mode */}
          {!query.trim() && (
            <div className="px-4 py-2 bg-slate-900/60 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>{searchHistory.length > 0 ? '🕒 ประวัติการค้นหาล่าสุด' : '🔥 หุ้นและ ETF ยอดนิยม'}</span>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  type="button"
                  className="text-[10px] text-slate-400 hover:text-rose-400 font-normal transition-colors"
                >
                  ล้างประวัติ
                </button>
              )}
            </div>
          )}

          {/* Main Results List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-700/50">
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
                      setHoveredItem(item)
                    }}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-indigo-600/30 border-l-4 border-indigo-500 text-white' : 'hover:bg-slate-700/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded shrink-0">
                        {item.symbol}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight truncate">{item.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      ดูข้อมูล →
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Integrated Instant Preview Footer Card */}
          {activePreviewItem && (
            <div className="p-3.5 bg-slate-900/90 border-t border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold rounded shrink-0">
                    {activePreviewItem.symbol}
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {activePreviewItem.description}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                  {activePreviewItem.type || 'Stock'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectResult(activePreviewItem)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>🤖</span> รายงาน AI ({activePreviewItem.symbol})
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectResult(activePreviewItem)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs py-2 px-3 rounded-xl border border-slate-700 transition-colors text-center"
                >
                  ดูรายละเอียด →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
