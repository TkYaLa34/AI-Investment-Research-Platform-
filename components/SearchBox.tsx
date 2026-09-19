'use client'

import React from 'react'
import { TickerSearch } from '@/components/TickerSearch'

interface SearchBoxProps {
  placeholder?: string
  className?: string
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'ค้นหาชื่อย่อหุ้น หรือ ETF (เช่น AAPL, NVDA, SPY)...',
  className = '',
}) => {
  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <TickerSearch placeholder={placeholder} />
    </div>
  )
}
