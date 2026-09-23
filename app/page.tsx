import Link from 'next/link'
import { TickerSearch } from '@/components/TickerSearch'
import { StockQuoteCard } from '@/components/StockQuoteCard'
import { AIInsightsPanel } from '@/components/AIInsightsPanel'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <span>📡</span> แพลตฟอร์มวิเคราะห์หุ้นสหรัฐฯ และ ETF ระดับสถาบัน
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            InvestRadar AI Research Platform
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            วิเคราะห์งบการเงินย้อนหลัง รายงาน SEC Filings (10-K/10-Q) และประมวลผลบทวิเคราะห์ด้วย Gemini AI สำหรับนักลงทุนระยะยาว
          </p>

          <div className="pt-2">
            <TickerSearch placeholder="ค้นหาชื่อย่อหุ้น หรือ ETF (เช่น AAPL, NVDA, MSFT, SPY)..." />
          </div>
        </section>

        {/* Trending Tickers & Real-time Quotes Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔥 หุ้นยอดนิยมประจำวัน (Trending Stocks)
            </h2>
            <span className="text-xs text-indigo-400 font-mono">Real-time Market Feed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StockQuoteCard symbol="AAPL" />
            <StockQuoteCard symbol="NVDA" />
            <StockQuoteCard symbol="MSFT" />
          </div>
        </section>

        {/* Featured Gemini AI Market Insight */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🤖 บทวิเคราะห์ภาพรวมตลาดโดย Gemini AI
            </h2>
            <Link href="/company/nvda" className="text-xs text-indigo-400 hover:underline">
              ดูรายงานหุ้น NVDA ↗
            </Link>
          </div>

          <AIInsightsPanel symbol="NVDA" />
        </section>

        {/* Quick Access Research Categories */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <Link
            href="/screener"
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500/50 transition-all space-y-2 group"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-base font-bold text-white">Stock Screener</h3>
            <p className="text-xs text-slate-400">คัดกรองหุ้นตามเงื่อนไข P/E, P/B, FCF และอัตราการเติบโต</p>
          </Link>

          <Link
            href="/dcf"
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500/50 transition-all space-y-2 group"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">🧮</div>
            <h3 className="text-base font-bold text-white">DCF Valuation</h3>
            <p className="text-xs text-slate-400">ประเมินมูลค่าหุ้นที่แท้จริง (Intrinsic Value) ด้วย FCF Model</p>
          </Link>

          <Link
            href="/company/aapl/financials"
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500/50 transition-all space-y-2 group"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-base font-bold text-white">Financial Statements</h3>
            <p className="text-xs text-slate-400">ตรวจสอบงบกำไรขาดทุน งบดุล และงบกระแสเงินสดจาก SEC</p>
          </Link>

          <Link
            href="/sectors"
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500/50 transition-all space-y-2 group"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">🌐</div>
            <h3 className="text-base font-bold text-white">Sectors & Themes</h3>
            <p className="text-xs text-slate-400">ติดตามแนวโน้มกลุ่มอุตสาหกรรม และธีมเทคโนโลยี AI</p>
          </Link>
        </section>
      </div>
    </div>
  )
}
