import React from 'react'
import type { AiAnalysis } from '@/types/database'

interface EvidenceStructure {
  sources?: string[]
  financial_highlights?: string[]
  sec_filing_references?: string[]
  [key: string]: any
}

interface AiAnalysisReportProps {
  analysis: AiAnalysis
  className?: string
}

export const AiAnalysisReport: React.FC<AiAnalysisReportProps> = ({ analysis, className = '' }) => {
  const evidence = (analysis.evidence as EvidenceStructure) || {}
  const sources = evidence.sources || []
  const financialHighlights = evidence.financial_highlights || []
  const secFilingReferences = evidence.sec_filing_references || []

  return (
    <div className={`bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 backdrop-blur-sm ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xl">
            🧠
          </span>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">รายงานวิจัยและวิเคราะห์การลงทุนด้วย AI</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              สร้างเมื่อวันที่ {new Date(analysis.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
          สังเคราะห์ด้วย AI
        </span>
      </div>

      {/* Summary Section */}
      {analysis.summary && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400">บทสรุปผู้บริหาร (Executive Summary)</h4>
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/40 border border-slate-700/40 rounded-xl p-4">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Bull & Bear Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bull Case */}
        {analysis.bull_case && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span>📈</span> ปัจจัยสนับสนุนเชิงบวก (Bull Case)
            </h4>
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {analysis.bull_case}
            </div>
          </div>
        )}

        {/* Bear Case */}
        {analysis.bear_case && (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <span>📉</span> ปัจจัยเสี่ยงเชิงลบ (Bear Case)
            </h4>
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {analysis.bear_case}
            </div>
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      {analysis.risk_assessment && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>⚠️</span> การประเมินระดับความเสี่ยง (Risk Assessment)
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed">
            {analysis.risk_assessment}
          </p>
        </div>
      )}

      {/* Evidentiary Sources & Citations */}
      {(sources.length > 0 || financialHighlights.length > 0 || secFilingReferences.length > 0) && (
        <div className="border-t border-slate-700/60 pt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>🔍</span> แหล่งข้อมูลอ้างอิงและหลักฐานประกอบการวิเคราะห์
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {sources.length > 0 && (
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-1.5 border border-slate-700/50">
                <p className="font-semibold text-slate-300">แหล่งข้อมูล</p>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {sources.map((src, i) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            )}

            {financialHighlights.length > 0 && (
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-1.5 border border-slate-700/50">
                <p className="font-semibold text-slate-300">ตัวเลขงบการเงินสำคัญ</p>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {financialHighlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}

            {secFilingReferences.length > 0 && (
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-1.5 border border-slate-700/50">
                <p className="font-semibold text-slate-300">อ้างอิงเอกสาร SEC</p>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {secFilingReferences.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
