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

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Investor'
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
                Personalized Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Track your saved stocks, view real-time valuation metrics, and access AI-driven fundamental research reports.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/watchlist"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <span>★</span> Manage Watchlist
            </Link>
          </div>
        </section>

        {/* Quick Summary Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Watchlist Items</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{watchlistCount}</p>
            <p className="text-xs text-slate-400 mt-1">Saved stocks & ETFs</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Price Feeds</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{activeFeedsCount}</p>
            <p className="text-xs text-slate-400 mt-1">Live market data streaming</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Indexed Companies</p>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{allCompanies.length}</p>
            <p className="text-xs text-slate-400 mt-1">Available for fundamental AI analysis</p>
          </div>
        </section>

        {/* Saved Watchlist Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <span className="text-amber-400">★</span> My Watchlist Highlights
            </h2>
            <Link href="/watchlist" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              View All Watchlist Items →
            </Link>
          </div>

          {watchlistItems.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-3">
              <div className="text-3xl text-amber-400">☆</div>
              <h3 className="text-lg font-bold text-white">No stocks added to your watchlist yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore available companies below and click &quot;Add to Watchlist&quot; to customize your dashboard.
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
                        <p className="text-slate-400">Current Price</p>
                        <p className="text-lg font-bold text-emerald-400 mt-0.5">
                          {stock?.current_price !== null && stock?.current_price !== undefined
                            ? `$${stock.current_price.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">P/E Ratio</p>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">
                          {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {company?.id && (
                      <Link
                        href={`/company/${company.id}`}
                        className="block text-center bg-slate-700/50 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                      >
                        View Full Research & AI Report →
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
              <span>📡</span> All Tracked Companies
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
                      <p className="text-slate-400">Price</p>
                      <p className="text-base font-bold text-emerald-400 mt-0.5">
                        {stock?.current_price !== null && stock?.current_price !== undefined
                          ? `$${stock.current_price.toFixed(2)}`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Market Cap</p>
                      <p className="text-xs font-semibold text-slate-200 mt-0.5">
                        {company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/company/${company.id}`}
                    className="block text-center bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs py-2 rounded-xl border border-indigo-500/30 transition-colors"
                  >
                    View Details & Reports →
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
