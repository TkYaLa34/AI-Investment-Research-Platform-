'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/Client'
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand & Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-500 transition-colors">
              📡
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">InvestRadar AI</span>
            </div>
          </Link>

          {user && (
            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                แผงควบคุม (Dashboard)
              </Link>
              <Link href="/watchlist" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>★</span> รายการหุ้นโปรด
              </Link>
            </nav>
          )}
        </div>

        {/* User Navigation / Auth Badge */}
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Info */}
                  <Link href="/dashboard" className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-full px-3 py-1.5 transition-colors">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="User Avatar"
                        width={28}
                        height={28}
                        className="rounded-full border border-slate-600"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {fullName ? fullName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="text-xs">
                      <p className="font-semibold text-white max-w-[140px] truncate leading-tight">
                        {fullName}
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-[140px] truncate leading-tight">
                        {user.email}
                      </p>
                    </div>
                  </Link>

                  {/* Sign Out Button */}
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
