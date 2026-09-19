import React from 'react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
  message = 'ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-3 backdrop-blur-md ${className}`}>
      <div className="text-2xl">⚠️</div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="text-xs text-rose-400 font-mono leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-colors shadow-md mt-2"
        >
          🔄 ลองใหม่อีกครั้ง (Retry)
        </button>
      )}
    </div>
  )
}
