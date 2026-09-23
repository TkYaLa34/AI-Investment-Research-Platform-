'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/Client'

type AuthMethod = 'password' | 'magic'
type PasswordMode = 'signin' | 'signup'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password')
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('signin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const clearMessages = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleGoogleSignIn = async () => {
    try {
      clearMessages()
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดไม่คาดคิดขณะเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()

      if (passwordMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          setErrorMessage(error.message === 'Invalid login credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : error.message)
        } else {
          setSuccessMessage('เข้าสู่ระบบสำเร็จ กำลังนำคุณไปยังหน้าหลัก...')
          window.location.href = '/dashboard'
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          setErrorMessage(error.message)
        } else {
          setSuccessMessage('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยัน บัญชี')
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดขณะดำเนินการ')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (!email.trim()) {
      setErrorMessage('กรุณากรอกอีเมลสำหรับรับ Magic Link')
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        setSuccessMessage('ส่ง Magic Link เรียบร้อยแล้ว! กรุณาตรวจสอบกล่องจดหมายในอีเมลของคุณ')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดขณะส่ง Magic Link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-2xl text-indigo-400">
            📡
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            เข้าสู่ระบบ InvestRadar AI
          </h1>
          <p className="text-slate-400 text-sm">
            เข้าถึงงานวิจัยปัจจัยพื้นฐาน รายงานวิเคราะห์ AI และติดตามหุ้นโปรดส่วนบุคคล
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password')
              clearMessages()
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMethod === 'password'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 อีเมล & รหัสผ่าน
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('magic')
              clearMessages()
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMethod === 'magic'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Magic Link
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3.5 text-xs text-rose-300 text-center font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3.5 text-xs text-emerald-300 text-center font-medium">
            ✅ {successMessage}
          </div>
        )}

        {/* Form 1: Email & Password */}
        {authMethod === 'password' && (
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
            {/* Mode Switch: Sign In vs Sign Up */}
            <div className="flex justify-center gap-4 text-xs font-medium border-b border-slate-700/50 pb-2">
              <button
                type="button"
                onClick={() => {
                  setPasswordMode('signin')
                  clearMessages()
                }}
                className={`pb-1 ${
                  passwordMode === 'signin'
                    ? 'text-indigo-400 font-bold border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                เข้าสู่ระบบ (Sign In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordMode('signup')
                  clearMessages()
                }}
                className={`pb-1 ${
                  passwordMode === 'signup'
                    ? 'text-indigo-400 font-bold border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                สมัครสมาชิก (Sign Up)
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">อีเมล (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">รหัสผ่าน (Password)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
            >
              {loading
                ? 'กำลังดำเนินการ...'
                : passwordMode === 'signin'
                ? 'เข้าสู่ระบบด้วยอีเมล'
                : 'สร้างบัญชีใหม่'}
            </button>
          </form>
        )}

        {/* Form 2: Magic Link */}
        {authMethod === 'magic' && (
          <form onSubmit={handleMagicLinkAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">อีเมลของคุณ (Email Address)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                เราจะส่งลิงก์สำหรับเข้าสู่ระบบแบบไม่ต้องใช้รหัสผ่านไปยังกล่องจดหมายของคุณ
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'กำลังส่ง Magic Link...' : '✨ ส่ง Magic Link เข้าสู่ระบบ'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-700/60 w-full"></div>
          <span className="bg-slate-800 px-3 text-[11px] text-slate-400 uppercase font-semibold relative">
            หรือ
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? 'กำลังเชื่อมต่อกับ Google...' : 'เข้าสู่ระบบด้วย Google'}
        </button>

        <p className="text-center text-xs text-slate-500">
          เมื่อเข้าสู่ระบบ แสดงว่าคุณยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัวของเรา
        </p>
      </div>
    </div>
  )
}
