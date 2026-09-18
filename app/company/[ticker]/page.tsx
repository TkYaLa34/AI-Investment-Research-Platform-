import Link from 'next/link'
import { StockQuoteCard } from '@/components/StockQuoteCard'
import { StockChart } from '@/components/StockChart'
import { AIInsightsPanel } from '@/components/AIInsightsPanel'
import { FinancialsView } from '@/components/FinancialsView'

export const dynamic = 'force-dynamic'

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const cleanTicker = ticker.toUpperCase()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <span>←</span> หน้าหลัก
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold">{cleanTicker}</span>
          </div>

          {/* Subpage Nav Links */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link href={`/company/${cleanTicker.toLowerCase()}`} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg">
              ภาพรวม (Overview)
            </Link>
            <Link href={`/company/${cleanTicker.toLowerCase()}/financials`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
              งบการเงิน (Financials)
            </Link>
            <Link href={`/company/${cleanTicker.toLowerCase()}/filings`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
              เอกสาร SEC Filings
            </Link>
          </div>
        </nav>

        {/* Stock Detail Header & Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StockQuoteCard symbol={cleanTicker} />
          </div>
          <div className="lg:col-span-2">
            <StockChart symbol={cleanTicker} />
          </div>
        </div>

        {/* Gemini AI Insights Panel */}
        <section>
          <AIInsightsPanel symbol={cleanTicker} />
        </section>

        {/* Financial Statements & SEC Filings Module */}
        <section>
          <FinancialsView symbol={cleanTicker} />
        </section>
      </div>
    </div>
  )
}
