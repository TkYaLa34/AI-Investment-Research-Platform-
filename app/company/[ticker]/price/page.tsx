import Link from 'next/link'
import { StockQuoteCard } from '@/components/StockQuoteCard'
import { StockChart } from '@/components/StockChart'

export const dynamic = 'force-dynamic'

export default async function PricePage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const cleanTicker = ticker.toUpperCase()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/company/${cleanTicker.toLowerCase()}`} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <span>←</span> กลับสู่ภาพรวม {cleanTicker}
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold">ราคาเรียลไทม์ & กราฟเชิงเทคนิค (Real-time Price & Chart)</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StockQuoteCard symbol={cleanTicker} />
          </div>
          <div className="lg:col-span-2">
            <StockChart symbol={cleanTicker} />
          </div>
        </div>
      </div>
    </div>
  )
}
