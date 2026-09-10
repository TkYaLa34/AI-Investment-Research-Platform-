import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWatchlist } from '@/lib/watchlist'
import { WatchlistButton } from '@/components/WatchlistButton'

export const dynamic = 'force-dynamic'

export default async function WatchlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const items = await getUserWatchlist(user.id)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg">
                ★
              </span>
              รายการหุ้นโปรดของฉัน (My Watchlist)
            </h1>
            <p className="text-slate-400 mt-1">
              ติดตามราคาและมูลค่าหุ้นและ ETF ที่คุณสนใจเป็นพิเศษ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-xs font-medium">
              บันทึกไว้ {items.length} รายการ
            </span>
          </div>
        </header>

        {/* Watchlist Grid */}
        {items.length === 0 ? (
          <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-12 text-center space-y-4">
            <div className="text-4xl text-amber-400">☆</div>
            <h3 className="text-xl font-bold text-white">ยังไม่มีหุ้นในรายการโปรดของคุณ</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              คุณสามารถกดบันทึกหุ้นที่สนใจจากแผงควบคุมหลักหรือหน้ารายละเอียดบริษัทเพื่อติดตามข้อมูลอย่างใกล้ชิด
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-colors"
            >
              ค้นหาหุ้นบนแผงควบคุมหลัก
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const company = item.company
              const stock = item.stock

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-xl hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-sm font-bold rounded-md inline-block">
                          {item.ticker}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2 leading-snug">
                          {company?.name || item.ticker}
                        </h3>
                      </div>
                      <WatchlistButton ticker={item.ticker} companyId={company?.id} />
                    </div>

                    {company && (
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        {company.sector && (
                          <span className="bg-slate-700/50 text-slate-300 px-2.5 py-0.5 rounded-full">
                            กลุ่มอุตสาหกรรม: {company.sector}
                          </span>
                        )}
                        {company.industry && (
                          <span className="bg-slate-700/30 text-slate-400 px-2.5 py-0.5 rounded-full">
                            หมวดธุรกิจ: {company.industry}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing metrics */}
                  <div className="pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">ราคาปัจจุบัน</p>
                      <p className="text-xl font-bold text-emerald-400 mt-0.5">
                        {stock?.current_price !== null && stock?.current_price !== undefined
                          ? `$${stock.current_price.toFixed(2)}`
                          : 'ไม่มีข้อมูล'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">อัตราส่วน P/E</p>
                      <p className="text-base font-semibold text-slate-200 mt-0.5">
                        {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'ไม่มีข้อมูล'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {company?.id && (
                    <div className="pt-2">
                      <Link
                        href={`/company/${company.id}`}
                        className="block w-full text-center bg-slate-700/60 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-xs py-2 rounded-xl border border-slate-600/50 transition-colors"
                      >
                        ดูรายละเอียดบริษัทและรายงานวิจัย →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
