import Link from 'next/link'
import { StockQuoteCard } from '@/components/StockQuoteCard'

export const dynamic = 'force-dynamic'

export default async function EtfDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const cleanTicker = ticker.toUpperCase()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <span>←</span> หน้าหลัก
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-bold">ETF Overview ({cleanTicker})</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StockQuoteCard symbol={cleanTicker} />
          </div>
          <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🌐 โครงสร้างกองทุน ETF ({cleanTicker})
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ติดตามมูลค่าทรัพย์สินสุทธิ (NAV) อัตราค่าธรรมเนียมการจัดการ (Expense Ratio) และกลุ่มหลักทรัพย์ที่ถือครองสูงสุดในกองทุน ETF
            </p>
            <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-xs text-slate-400">
              ข้อมูลโครงสร้างการถือครองหุ้นของกองทุน ETF กำลังซิงค์กับฐานข้อมูลสถาบัน
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
