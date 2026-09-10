'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/Client'

interface WatchlistButtonProps {
  ticker: string
  companyId?: string | null
  className?: string
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  ticker,
  companyId,
  className = '',
}) => {
  const [inWatchlist, setInWatchlist] = useState<boolean>(false)
  const [watchlistId, setWatchlistId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Check if ticker is in user's watchlist
        const { data } = await supabase
          .from('watchlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('ticker', ticker.toUpperCase())
          .maybeSingle()

        if (data) {
          setInWatchlist(true)
          setWatchlistId(data.id)
        } else {
          setInWatchlist(false)
          setWatchlistId(null)
        }
      } catch (err) {
        console.error('Error checking watchlist status:', err)
      } finally {
        setLoading(false)
      }
    }

    checkWatchlistStatus()
  }, [ticker])

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setActionLoading(true)
    try {
      if (inWatchlist && watchlistId) {
        // Remove from watchlist
        const res = await fetch(`/api/watchlist?id=${watchlistId}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setInWatchlist(false)
          setWatchlistId(null)
          router.refresh()
        }
      } else {
        // Add to watchlist
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticker,
            company_id: companyId,
          }),
        })
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setInWatchlist(true)
            setWatchlistId(json.data.id)
            router.refresh()
          }
        }
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className={`px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-500 text-xs font-semibold ${className}`}
      >
        กำลังโหลด...
      </button>
    )
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={actionLoading}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 shadow-sm ${
        inWatchlist
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
      } ${className}`}
    >
      <span>{inWatchlist ? '★ อยู่ในรายการโปรด' : '☆ เพิ่มในรายการโปรด'}</span>
    </button>
  )
}
