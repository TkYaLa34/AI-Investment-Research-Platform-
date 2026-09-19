import React from 'react'

export interface FilingItem {
  accessionNumber: string
  form: string
  filingDate: string
  reportDate?: string
  primaryDocDescription: string
  documentUrl?: string
}

interface FilingListProps {
  filings: FilingItem[]
  className?: string
}

export const FilingList: React.FC<FilingListProps> = ({ filings, className = '' }) => {
  if (!filings || filings.length === 0) {
    return (
      <div className={`bg-slate-800/40 border border-slate-700 rounded-xl p-8 text-center text-slate-400 text-xs ${className}`}>
        ไม่พบรายงานยื่น SEC สำหรับบริษัทนี้
      </div>
    )
  }

  return (
    <div className={`divide-y divide-slate-700/50 bg-slate-900/50 rounded-xl border border-slate-700/80 overflow-hidden ${className}`}>
      {filings.map((filing, index) => (
        <div key={index} className="p-4 flex items-center justify-between text-xs hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                filing.form === '10-K'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {filing.form}
            </span>
            <div>
              <p className="font-bold text-white leading-tight">{filing.primaryDocDescription}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                วันที่ยื่น: {filing.filingDate} • Accession: {filing.accessionNumber}
              </p>
            </div>
          </div>
          {filing.documentUrl ? (
            <a
              href={filing.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline shrink-0 ml-2"
            >
              อ่านเอกสาร SEC ↗
            </a>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">{filing.accessionNumber}</span>
          )}
        </div>
      ))}
    </div>
  )
}
