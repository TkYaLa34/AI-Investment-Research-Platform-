import Link from 'next/link'
import { TickerSearch } from '@/components/TickerSearch'

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <span>←</span> กลับสู่หน้าหลัก
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-bold">ผลการค้นหาหุ้นและ ETF</span>
        </nav>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">ค้นหาข้อมูลบริษัทและ ETF</h1>
            <p className="text-xs text-slate-400">ค้นหาชื่อย่อหุ้นเพื่อเข้าถึงงบการเงิน รายงาน SEC Filings และวิเคราะห์ AI</p>
          </div>

          <TickerSearch />
        </div>
      </div>
    </div>
  )
}
