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
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

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
    setIsOpen(false)
    setQuery('')
    // Route to company detail or search query
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
        <div className="absolute left-0 right-0 mt-2 bg-slate-800/95 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-md max-h-80 overflow-y-auto divide-y divide-slate-700/50">
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
                  onMouseEnter={() => setSelectedIndex(index)}
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
                  <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ดูข้อมูล →
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
