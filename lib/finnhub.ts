/**
 * Finnhub API Service Utility
 *
 * Integrates with Finnhub Stock Symbol Search endpoint (https://finnhub.io/api/v1/search)
 * and Stock Quote endpoint (https://finnhub.io/api/v1/quote).
 * Provides graceful fallback dataset when FINNHUB_API_KEY environment variable is not configured.
 */

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY || ''
const FINNHUB_SEARCH_URL = 'https://finnhub.io/api/v1/search'
const FINNHUB_QUOTE_URL = 'https://finnhub.io/api/v1/quote'

export interface FinnhubSearchResult {
  symbol: string
  description: string
  type: string
  displaySymbol?: string
}

export interface FinnhubQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High
  l: number // Low
  o: number // Open
  pc: number // Previous close
}

// Fallback search dataset when API key is unpopulated
const FALLBACK_TICKERS: FinnhubSearchResult[] = [
  { symbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' },
  { symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' },
  { symbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Common Stock' },
  { symbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Common Stock' },
  { symbol: 'AMZN', description: 'Amazon.com Inc.', type: 'Common Stock' },
  { symbol: 'META', description: 'Meta Platforms Inc.', type: 'Common Stock' },
  { symbol: 'TSLA', description: 'Tesla Inc.', type: 'Common Stock' },
  { symbol: 'SPY', description: 'SPDR S&P 500 ETF Trust', type: 'ETP' },
  { symbol: 'QQQ', description: 'Invesco QQQ Trust Series 1', type: 'ETP' },
]

export async function searchTickers(query: string): Promise<FinnhubSearchResult[]> {
  const cleanQuery = query.trim().toUpperCase()
  if (!cleanQuery) {
    return []
  }

  if (!FINNHUB_API_KEY) {
    // Return filtered fallback dataset when API key is missing
    return FALLBACK_TICKERS.filter(
      (item) =>
        item.symbol.includes(cleanQuery) ||
        item.description.toUpperCase().includes(cleanQuery)
    )
  }

  try {
    const url = `${FINNHUB_SEARCH_URL}?q=${encodeURIComponent(cleanQuery)}&token=${FINNHUB_API_KEY}`
    const res = await fetch(url, { next: { revalidate: 300 } })

    if (!res.ok) {
      throw new Error(`Finnhub API Error: HTTP ${res.status}`)
    }

    const data = await res.json()
    const resultList: any[] = data.result || []

    return resultList.map((item) => ({
      symbol: item.symbol,
      description: item.description,
      type: item.type || 'Stock',
      displaySymbol: item.displaySymbol,
    }))
  } catch (err) {
    console.error('Error querying Finnhub API:', err)
    // Fallback to local filtering on API failure
    return FALLBACK_TICKERS.filter(
      (item) =>
        item.symbol.includes(cleanQuery) ||
        item.description.toUpperCase().includes(cleanQuery)
    )
  }
}

export async function getQuote(symbol: string): Promise<FinnhubQuote> {
  const cleanSymbol = symbol.trim().toUpperCase()
  if (!cleanSymbol) {
    return { c: 0, d: 0, dp: 0, h: 0, l: 0, o: 0, pc: 0 }
  }

  if (FINNHUB_API_KEY) {
    try {
      const url = `${FINNHUB_QUOTE_URL}?symbol=${encodeURIComponent(cleanSymbol)}&token=${FINNHUB_API_KEY}`
      const res = await fetch(url, { next: { revalidate: 60 } })

      if (res.ok) {
        const data = await res.json()
        if (data && typeof data.c === 'number' && data.c !== 0) {
          return {
            c: data.c,
            d: data.d ?? 0,
            dp: data.dp ?? 0,
            h: data.h ?? data.c,
            l: data.l ?? data.c,
            o: data.o ?? data.c,
            pc: data.pc ?? data.c,
          }
        }
      }
    } catch (err) {
      console.error('Error fetching quote from Finnhub API:', err)
    }
  }

  // Graceful fallback mock quote when key is unpopulated or fetch fails
  return {
    c: 185.5,
    d: 2.35,
    dp: 1.28,
    h: 187.2,
    l: 183.1,
    o: 184.0,
    pc: 183.15,
  }
}
