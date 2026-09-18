import React from 'react'

interface LoadingStateProps {
  message?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'กำลังโหลดข้อมูลจากระบบ...',
  className = '',
}) => {
  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-xl animate-pulse text-center space-y-4 ${className}`}>
      <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-xs text-slate-400 font-medium">{message}</p>
    </div>
  )
}
