'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface StockContextType {
  selectedSymbol: string
  setSelectedSymbol: (symbol: string) => void
}

const StockContext = createContext<StockContextType | undefined>(undefined)

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL')

  return (
    <StockContext.Provider value={{ selectedSymbol, setSelectedSymbol }}>
      {children}
    </StockContext.Provider>
  )
}

export const useStock = (): StockContextType => {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStock must be used within a StockProvider')
  }
  return context
}
