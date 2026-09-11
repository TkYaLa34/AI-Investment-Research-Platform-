import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWatchlist } from '@/lib/watchlist'
import { WatchlistButton } from '@/components/WatchlistButton'
import type { Company, Stock } from '@/types/database'

export const dynamic = 'force-dynamic'

interface CompanyWithStock extends Company {
  stock?: Stock | null
}

async function getTrackedCompanies(): Promise<CompanyWithStock[]> {
  try {
    const supabase = await createClient()
    const { data: companies } = await supabase.from('companies').select('*')
    const { data: stocks } = await supabase.from('stocks').select('*')

    if (!companies) return []

    const stocksByCompanyId = new Map<string, Stock>()
    const stocksByTicker = new Map<string, Stock>()
    if (stocks) {
      stocks.forEach((s: Stock) => {
        if (s.company_id) stocksByCompanyId.set(s.company_id, s)
        if (s.ticker) stocksByTicker.set(s.ticker.toUpperCase(), s)
      })
    }

    return (companies as Company[]).map((company) => ({
      ...company,
      stock:
        stocksByCompanyId.get(company.id) ||
        stocksByTicker.get(company.ticker.toUpperCase()) ||
        null,
    }))
  } catch (err) {
    console.error('Error fetching tracked companies:', err)
    return []
  }
}

export default async function UserDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [watchlistItems, allCompanies] = await Promise.all([
    getUserWatchlist(user.id),
    getTrackedCompanies(),
  ])

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'นักลงทุน'
  const watchlistCount = watchlistItems.length
  const activeFeedsCount = watchlistItems.filter((i) => i.stock?.current_price !== null && i.stock?.current_price !== undefined).length

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-indigo-900/60 via-slate-800/80 to-slate-900/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-full">
                แผงควบคุมส่วนบุคคล
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              ยินดีต้อนรับกลับ, คุณ{userName}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              ติดตามหุ้นที่คุณบันทึกไว้ ตรวจสอบตัวชี้วัดมูลค่าเรียลไทม์ และเข้าถึงรายงานวิเคราะห์ปัจจัยพื้นฐานด้วยระบบ AI
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/watchlist"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <span>★</span> จัดการรายการหุ้นโปรด
            </Link>
          </div>
        </section>

        {/* Quick Summary Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">หุ้นโปรดในรายการ</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{watchlistCount} หุ้น</p>
            <p className="text-xs text-slate-400 mt-1">รายการหุ้นและ ETF ที่บันทึกไว้</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ฟีดราคาเรียลไทม์</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{activeFeedsCount} รายการ</p>
            <p className="text-xs text-slate-400 mt-1">สตรีมข้อมูลราคาตลาดสด</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">บริษัทในระบบทั้งหมด</p>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{allCompanies.length} บริษัท</p>
            <p className="text-xs text-slate-400 mt-1">พร้อมสำหรับวิเคราะห์ปัจจัยพื้นฐานด้วย AI</p>
          </div>
        </section>

        {/* Saved Watchlist Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <span className="text-amber-400">★</span> หุ้นโปรดของคุณ
            </h2>
            <Link href="/watchlist" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              ดูรายการหุ้นโปรดทั้งหมด →
            </Link>
          </div>

          {watchlistItems.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-3">
              <div className="text-3xl text-amber-400">☆</div>
              <h3 className="text-lg font-bold text-white">ยังไม่มีหุ้นในรายการโปรดของคุณ</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                ค้นหาและสำรวจบริษัทด้านล่าง จากนั้นกด &quot;เพิ่มในรายการโปรด&quot; เพื่อปรับแต่งแผงควบคุมของคุณ
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlistItems.map((item) => {
                const company = item.company
                const stock = item.stock

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded-md inline-block">
                            {item.ticker}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1 leading-snug">
                            {company?.name || item.ticker}
                          </h3>
                        </div>
                        <WatchlistButton ticker={item.ticker} companyId={company?.id} />
                      </div>

                      {company?.sector && (
                        <p className="text-xs text-slate-400">{company.sector}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-400">ราคาปัจจุบัน</p>
                        <p className="text-lg font-bold text-emerald-400 mt-0.5">
                          {stock?.current_price !== null && stock?.current_price !== undefined
                            ? `$${stock.current_price.toFixed(2)}`
                            : 'ไม่มีข้อมูล'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">อัตราส่วน P/E</p>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">
                          {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'ไม่มีข้อมูล'}
                        </p>
                      </div>
                    </div>

                    {company?.id && (
                      <Link
                        href={`/company/${company.id}`}
                        className="block text-center bg-slate-700/50 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                      >
                        ดูข้อมูลฉบับเต็มและรายงาน AI →
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Tracked Companies Overview */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <span>📡</span> บริษัททั้งหมดในระบบ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCompanies.map((company) => {
              const stock = company.stock
              return (
                <div
                  key={company.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-lg hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded-md inline-block">
                          {company.ticker}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1 leading-snug">
                          {company.name}
                        </h3>
                      </div>
                      <WatchlistButton ticker={company.ticker} companyId={company.id} />
                    </div>

                    <p className="text-xs text-slate-400">
                      {company.sector} • {company.industry}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">ราคา</p>
                      <p className="text-base font-bold text-emerald-400 mt-0.5">
                        {stock?.current_price !== null && stock?.current_price !== undefined
                          ? `$${stock.current_price.toFixed(2)}`
                          : 'ไม่มีข้อมูล'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">มูลค่าตลาด</p>
                      <p className="text-xs font-semibold text-slate-200 mt-0.5">
                        {company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'ไม่มีข้อมูล'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/company/${company.id}`}
                    className="block text-center bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs py-2 rounded-xl border border-indigo-500/30 transition-colors"
                  >
                    ดูรายละเอียดและรายงาน →
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
