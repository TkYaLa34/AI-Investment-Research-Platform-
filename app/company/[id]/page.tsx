import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AiAnalysisReport } from '@/components/AiAnalysisReport'
import type { Company, Stock, Financials, Earnings, SecFiling, AiAnalysis } from '@/types/database'

export const dynamic = 'force-dynamic'

interface CompanyDetails {
  company: Company
  stock: Stock | null
  financials: Financials[]
  earnings: Earnings[]
  secFilings: SecFiling[]
  latestAnalysis: AiAnalysis | null
}

async function getCompanyData(id: string): Promise<CompanyDetails | null> {
  try {
    const supabase = await createClient()

    // Fetch company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (companyError || !company) {
      return null
    }

    // Fetch stock
    const { data: stock } = await supabase
      .from('stocks')
      .select('*')
      .or(`company_id.eq.${id},ticker.eq.${company.ticker}`)
      .maybeSingle()

    // Fetch financials
    const { data: financials } = await supabase
      .from('financials')
      .select('*')
      .eq('company_id', id)
      .order('fiscal_year', { ascending: false })

    // Fetch earnings
    const { data: earnings } = await supabase
      .from('earnings')
      .select('*')
      .eq('company_id', id)
      .order('fiscal_year', { ascending: false })

    // Fetch SEC filings
    const { data: secFilings } = await supabase
      .from('sec_filings')
      .select('*')
      .eq('company_id', id)
      .order('filing_date', { ascending: false })

    // Fetch AI analyses
    const { data: aiAnalyses } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(1)

    return {
      company: company as Company,
      stock: (stock as Stock) || null,
      financials: (financials as Financials[]) || [],
      earnings: (earnings as Earnings[]) || [],
      secFilings: (secFilings as SecFiling[]) || [],
      latestAnalysis: (aiAnalyses?.[0] as AiAnalysis) || null,
    }
  } catch (err) {
    console.error('Error fetching company details:', err)
    return null
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const companyData = await getCompanyData(id)

  if (!companyData) {
    notFound()
  }

  const { company, stock, financials, earnings, secFilings, latestAnalysis } = companyData

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation / Back link */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <span>←</span> Back to Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-medium">{company.ticker}</span>
        </nav>

        {/* Company Header Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-base font-bold rounded-lg">
                  {company.ticker}
                </span>
                {stock?.asset_type && (
                  <span className="px-2.5 py-0.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded uppercase tracking-wider">
                    {stock.asset_type}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {company.name}
              </h1>

              {company.description && (
                <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                  {company.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {company.sector && (
                  <span className="bg-slate-700/60 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                    Sector: {company.sector}
                  </span>
                )}
                {company.industry && (
                  <span className="bg-slate-700/40 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                    Industry: {company.industry}
                  </span>
                )}
              </div>
            </div>

            {/* Price Badge */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-5 md:min-w-[200px] text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Stock Price</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                {stock?.current_price !== null && stock?.current_price !== undefined
                  ? `$${stock.current_price.toFixed(2)}`
                  : 'N/A'}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Market Cap: {company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis Report Display */}
        {latestAnalysis ? (
          <section className="space-y-4">
            <AiAnalysisReport analysis={latestAnalysis} />
          </section>
        ) : (
          <section className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-3">
            <div className="text-2xl">🧠</div>
            <h3 className="text-lg font-bold text-white">No AI Analysis Report Available Yet</h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              An AI analysis report has not been generated for {company.name} yet. Trigger the analysis API pipeline to synthesize fundamental insights and SEC filings.
            </p>
          </section>
        )}

        {/* Valuation & Performance Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Key Valuation & Stock Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Day High / Low</p>
              <p className="text-base font-semibold text-white mt-1">
                {stock?.day_high && stock?.day_low
                  ? `$${stock.day_high.toFixed(2)} / $${stock.day_low.toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Trading Volume</p>
              <p className="text-base font-semibold text-white mt-1">
                {stock?.volume ? stock.volume.toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">P/E Ratio</p>
              <p className="text-base font-semibold text-white mt-1">
                {stock?.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-medium">Dividend Yield</p>
              <p className="text-base font-semibold text-white mt-1">
                {stock?.dividend_yield ? `${(stock.dividend_yield * 100).toFixed(2)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Financial Performance Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Financial Statements Summary</h2>
          {financials.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
              No financial statements recorded for this company.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/80 shadow-lg">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/70">
                  <tr>
                    <th scope="col" className="px-6 py-4">Fiscal Year</th>
                    <th scope="col" className="px-6 py-4">Period</th>
                    <th scope="col" className="px-6 py-4">Revenue</th>
                    <th scope="col" className="px-6 py-4">Net Income</th>
                    <th scope="col" className="px-6 py-4">Total Assets</th>
                    <th scope="col" className="px-6 py-4">Total Liabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {financials.map((fin) => (
                    <tr key={fin.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{fin.fiscal_year}</td>
                      <td className="px-6 py-4 text-slate-400 uppercase">{fin.fiscal_period}</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        {fin.revenue ? `$${(fin.revenue / 1e6).toFixed(2)}M` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium text-indigo-400">
                        {fin.net_income ? `$${(fin.net_income / 1e6).toFixed(2)}M` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {fin.total_assets ? `$${(fin.total_assets / 1e6).toFixed(2)}M` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {fin.total_liabilities ? `$${(fin.total_liabilities / 1e6).toFixed(2)}M` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quarterly Earnings Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Earnings Performance</h2>
          {earnings.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
              No earnings history available for this company.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnings.map((earn) => (
                <div key={earn.id} className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-sm font-bold text-white">
                      FY{earn.fiscal_year} {earn.fiscal_quarter ? `Q${earn.fiscal_quarter}` : ''}
                    </span>
                    <span className="text-xs text-slate-400">
                      {earn.report_date ? new Date(earn.report_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">EPS Actual / Est.</p>
                      <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                        {earn.eps_actual !== null ? `$${earn.eps_actual.toFixed(2)}` : 'N/A'}
                        <span className="text-slate-400 text-xs font-normal">
                          {earn.eps_estimate !== null ? ` / $${earn.eps_estimate.toFixed(2)}` : ''}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Revenue Actual</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">
                        {earn.revenue_actual ? `$${(earn.revenue_actual / 1e6).toFixed(2)}M` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SEC Filings Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Official SEC Filings</h2>
          {secFilings.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
              No SEC filings found for this company.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-800/80 shadow-lg">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/70">
                  <tr>
                    <th scope="col" className="px-6 py-4">Filing Type</th>
                    <th scope="col" className="px-6 py-4">Filing Date</th>
                    <th scope="col" className="px-6 py-4">Period End Date</th>
                    <th scope="col" className="px-6 py-4">Document Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {secFilings.map((filing) => (
                    <tr key={filing.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded">
                          {filing.filing_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {new Date(filing.filing_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {filing.period_end_date ? new Date(filing.period_end_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {filing.document_url ? (
                          <a
                            href={filing.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 underline font-medium text-xs flex items-center gap-1"
                          >
                            View Filing Document ↗
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">No link available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
