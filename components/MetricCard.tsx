import React from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
  badge?: string
  badgeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  badge,
  badgeType = 'neutral',
  className = '',
}) => {
  const badgeClasses =
    badgeType === 'positive'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      : badgeType === 'negative'
      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      : 'bg-slate-700/50 border-slate-600 text-slate-300'

  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        {badge && (
          <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold rounded-full ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-white tracking-tight leading-none">{value}</p>
      {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
    </div>
  )
}
