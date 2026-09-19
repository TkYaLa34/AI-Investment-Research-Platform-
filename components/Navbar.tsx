'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/Client'
import { TickerSearch } from '@/components/TickerSearch'
import type { User } from '@supabase/supabase-js'

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center justify-between md:justify-start gap-6">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="p-2 bg-indigo-600 rounded-xl text-white group-hover:bg-indigo-500 transition-colors shadow-md text-lg">
              📡
            </span>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block">InvestRadar</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">
                AI-Powered US Stock & ETF Research
              </span>
            </div>
          </Link>

          {/* Research Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              📊 แผงควบคุม
            </Link>

            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                🔬 งานวิจัย & ประเมินมูลค่า
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-slate-800/95 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all divide-y divide-slate-700/40 z-50">
                <Link href="/screener" className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors">
                  🔍 Stock Screener (คัดกรองหุ้น)
                </Link>
                <Link href="/dcf" className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors">
                  🧮 DCF Valuation Model
                </Link>
                <Link href="/company/aapl/financials" className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors">
                  📑 งบการเงิน & SEC Filings
                </Link>
              </div>
            </div>

            <Link
              href="/sectors"
              className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              🌐 กลุ่มอุตสาหกรรม
            </Link>

            <Link
              href="/watchlist"
              className="px-3 py-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>★</span> รายการโปรด
            </Link>
          </nav>
        </div>

        {/* Center Search Input */}
        <div className="w-full md:max-w-xs lg:max-w-sm">
          <TickerSearch placeholder="ค้นหาหุ้น หรือ ETF (AAPL, NVDA, VOO, SPY)..." />
        </div>

        {/* User Account / Auth Status */}
        <div className="flex items-center gap-3 justify-end shrink-0">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/settings"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
                    title="ตั้งค่าบัญชี"
                  >
                    ⚙️
                  </Link>

                  <Link href="/dashboard" className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-full px-3 py-1 transition-colors">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="User Avatar"
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-600"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {fullName ? fullName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                      {fullName}
                    </span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 px-4 py-2 rounded-xl shadow-md transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
