/**
 * Ticker-to-CIK Mapping Utility
 */

import { secClientFetch } from './client'

const SEC_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'

let tickerToCikMap: Map<string, string> | null = null

export async function getTickerToCikMap(): Promise<Map<string, string>> {
  if (tickerToCikMap) {
    return tickerToCikMap
  }

  const map = new Map<string, string>()

  try {
    const data = await secClientFetch<Record<string, { cik_str: number; ticker: string; title: string }>>(SEC_TICKERS_URL)
    Object.values(data).forEach((entry) => {
      if (entry?.ticker && entry?.cik_str) {
        const cik10 = String(entry.cik_str).padStart(10, '0')
        map.set(entry.ticker.toUpperCase(), cik10)
      }
    })
    tickerToCikMap = map
  } catch (err) {
    console.error('Error fetching SEC company_tickers.json:', err)
  }

  return map
}

export async function getCikForTicker(ticker: string): Promise<string | null> {
  const map = await getTickerToCikMap()
  return map.get(ticker.toUpperCase()) || null
}
