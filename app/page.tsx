import { createClient } from '@/lib/supabase/server'
import type { Company, Stock } from '@/types/database'

export const dynamic = 'force-dynamic'

type CompanyWithStock = Company & {
  stock?: Stock | null
}

async function getDashboardData(): Promise<CompanyWithStock[]> {
  try {
    const supabase = await createClient()

    // Fetch companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')

    if (companiesError || !companies) {
      console.error('Error fetching companies:', companiesError)
      return []
    }

    // Fetch stocks
    const { data: stocks, error: stocksError } = await supabase
      .from('stocks')
      .select('*')

    if (stocksError) {
      console.error('Error fetching stocks:', stocksError)
    }

    const stocksByCompanyId = new Map<string, Stock>()
    const stocksByTicker = new Map<string, Stock>()

    if (stocks) {
      stocks.forEach((stock: Stock) => {
        if (stock.company_id) {
          stocksByCompanyId.set(stock.company_id, stock)
        }
        if (stock.ticker) {
          stocksByTicker.set(stock.ticker.toUpperCase(), stock)
        }
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
    console.error('Failed to load dashboard data:', err)
    return []
  }
}

export default async function DashboardPage() {
  const companies = await getDashboardData()

  // Calculate high-level summary metrics
  const totalCompanies = companies.length
  const stocksWithPrices = companies.filter((c) => c.stock?.current_price !== null && c.stock?.current_price !== undefined)
  const avgMarketCap = totalCompanies > 0
    ? companies.reduce((acc, c) => acc + (c.market_cap || 0), 0) / totalCompanies
    : 0

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-lg text-white">📡</span>
              InvestRadar AI
            </h1>
            <p className="text-slate-400 mt-1">
              Institutional-grade market intelligence & fundamental stock overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Live Supabase Data
            </span>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracked Companies</p>
            <p className="text-2xl font-bold text-white mt-2">{totalCompanies}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Price Feeds</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{stocksWithPrices.length}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Market Cap</p>
            <p className="text-2xl font-bold text-indigo-400 mt-2">
              {avgMarketCap ? `$${(avgMarketCap / 1e9).toFixed(2)}B` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Company Cards Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-wide">Market Overview Cards</h2>
          {companies.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-400">
              <p className="text-lg font-medium">No company records found in database.</p>
              <p className="text-sm text-slate-500 mt-1">Connect or populate your Supabase tables to view market data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => {
                const stock = company.stock
                return (
                  <div
                    key={company.id}
                    className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-6 shadow-lg hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-sm font-bold rounded-md inline-block">
                            {company.ticker}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-2 leading-snug">{company.name}</h3>
                        </div>
                        {stock?.asset_type && (
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded uppercase">
                            {stock.asset_type}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {company.sector && (
                          <span className="bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-full">
                            {company.sector}
                          </span>
                        )}
                        {company.industry && (
                          <span className="bg-slate-700/30 text-slate-400 px-2.5 py-1 rounded-full">
                            {company.industry}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Current Price</p>
                        <p className="text-xl font-bold text-emerald-400 mt-0.5">
                          {stock?.current_price !== null && stock?.current_price !== undefined
                            ? `$${stock.current_price.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Market Cap</p>
                        <p className="text-base font-semibold text-slate-200 mt-0.5">
                          {company.market_cap
                            ? `$${(company.market_cap / 1e9).toFixed(2)}B`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Day High / Low</p>
                        <p className="text-xs font-medium text-slate-300 mt-0.5">
                          {stock?.day_high && stock?.day_low
                            ? `$${stock.day_high.toFixed(2)} / $${stock.day_low.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">P/E Ratio</p>
                        <p className="text-xs font-medium text-slate-300 mt-0.5">
                          {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Detailed Table View */}
        {companies.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-white tracking-wide">Detailed Financial & Pricing Table</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/80 shadow-xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/70">
                  <tr>
                    <th scope="col" className="px-6 py-4">Ticker</th>
                    <th scope="col" className="px-6 py-4">Company Name</th>
                    <th scope="col" className="px-6 py-4">Sector</th>
                    <th scope="col" className="px-6 py-4">Current Price</th>
                    <th scope="col" className="px-6 py-4">Volume</th>
                    <th scope="col" className="px-6 py-4">P/E Ratio</th>
                    <th scope="col" className="px-6 py-4">Div Yield</th>
                    <th scope="col" className="px-6 py-4">Market Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {companies.map((company) => {
                    const stock = company.stock
                    return (
                      <tr key={company.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-indigo-400">{company.ticker}</td>
                        <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                        <td className="px-6 py-4 text-slate-400">{company.sector || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          {stock?.current_price !== null && stock?.current_price !== undefined
                            ? `$${stock.current_price.toFixed(2)}`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {stock?.volume ? stock.volume.toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {stock?.dividend_yield ? `${(stock.dividend_yield * 100).toFixed(2)}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
