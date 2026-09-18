import Link from 'next/link'
import { getFinancialsData } from '@/lib/financials'
import { FilingList } from '@/components/FilingList'

export const dynamic = 'force-dynamic'

export default async function FilingsPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const cleanTicker = ticker.toUpperCase()
  const financials = await getFinancialsData(cleanTicker)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/company/${cleanTicker.toLowerCase()}`} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <span>←</span> กลับสู่ภาพรวม {cleanTicker}
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold">รายงานทางการต่อ SEC Filings (10-K / 10-Q)</span>
          </div>
        </nav>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">รายการเอกสาร SEC Filings ({cleanTicker})</h2>
              <p className="text-xs text-slate-400 mt-1">
                {financials.entityName} {financials.cik ? `• CIK: ${financials.cik}` : ''}
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold rounded-lg">
              SEC EDGAR Verified
            </span>
          </div>

          <FilingList filings={financials.recentFilings} />
        </div>
      </div>
    </div>
  )
}
