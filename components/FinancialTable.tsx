import React from 'react'

export interface FinancialMetricRow {
  year: number | string
  revenue: number | null
  netIncome: number | null
  dilutedEps?: number | null
  operatingCashFlow?: number | null
  freeCashFlow?: number | null
  totalAssets?: number | null
  totalDebt?: number | null
}

interface FinancialTableProps {
  data: FinancialMetricRow[]
  className?: string
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ data, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-slate-800/40 border border-slate-700 rounded-xl p-8 text-center text-slate-400 text-xs ${className}`}>
        ไม่มีข้อมูลรายการงบการเงินสำหรับแสดงผล
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-900/60 shadow-xl ${className}`}>
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-700/70">
          <tr>
            <th scope="col" className="px-4 py-3.5">ปีงบการเงิน (Fiscal Year)</th>
            <th scope="col" className="px-4 py-3.5">รายได้รวม (Revenue)</th>
            <th scope="col" className="px-4 py-3.5">กำไรสุทธิ (Net Income)</th>
            <th scope="col" className="px-4 py-3.5">กระแสเงินสดอิสระ (FCF)</th>
            <th scope="col" className="px-4 py-3.5">สินทรัพย์รวม (Total Assets)</th>
            <th scope="col" className="px-4 py-3.5">หนี้สินรวม (Total Debt)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40 font-mono">
          {data.map((row) => (
            <tr key={row.year} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3.5 font-bold text-indigo-300">{row.year}</td>
              <td className="px-4 py-3.5 font-semibold text-white">
                {row.revenue !== null && row.revenue !== undefined
                  ? `$${(row.revenue / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3.5 font-semibold text-emerald-400">
                {row.netIncome !== null && row.netIncome !== undefined
                  ? `$${(row.netIncome / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3.5 text-slate-200">
                {row.freeCashFlow !== null && row.freeCashFlow !== undefined
                  ? `$${(row.freeCashFlow / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3.5 text-slate-300">
                {row.totalAssets !== null && row.totalAssets !== undefined
                  ? `$${(row.totalAssets / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3.5 text-rose-300">
                {row.totalDebt !== null && row.totalDebt !== undefined
                  ? `$${(row.totalDebt / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
