import React from 'react'

interface MetricCardProps {
  label: string
  value: string | number | null | undefined
  subValue?: string
  badge?: string
  badgeType?: 'positive' | 'negative' | 'neutral'
  tooltip?: string
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  badge,
  badgeType = 'neutral',
  tooltip,
  className = '',
}) => {
  const badgeClasses =
    badgeType === 'positive'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      : badgeType === 'negative'
      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      : 'bg-slate-700/50 border-slate-600 text-slate-300'

  const displayValue =
    value !== null && value !== undefined && value !== '' ? value : 'Data unavailable'

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-2 relative group ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          {tooltip && (
            <span
              className="text-[10px] text-indigo-400 cursor-help bg-indigo-500/10 border border-indigo-500/30 rounded-full w-4 h-4 inline-flex items-center justify-center font-bold"
              title={tooltip}
            >
              ?
            </span>
          )}
        </div>
        {badge && (
          <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold rounded-full ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>

      <p className={`text-2xl font-extrabold tracking-tight leading-none ${
        displayValue === 'Data unavailable' ? 'text-slate-500 text-base font-normal italic' : 'text-white'
      }`}>
        {displayValue}
      </p>

      {subValue && <p className="text-xs text-slate-400">{subValue}</p>}

      {/* Hover Info Tooltip Popup */}
      {tooltip && (
        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-30 w-64 p-3 bg-slate-900/95 border border-slate-700 text-slate-200 text-[11px] rounded-xl shadow-2xl backdrop-blur-md leading-relaxed">
          💡 {tooltip}
        </div>
      )}
    </div>
  )
}
