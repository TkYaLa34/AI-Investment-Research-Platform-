/**
 * SEC EDGAR Server-Side Utility Service
 *
 * Implements SEC EDGAR API interactions complying with SEC developer guidelines:
 * - Compliant User-Agent header (User-Agent: Sample Company Name AdminContact@<sample company domain>.com)
 * - Rate limit: Max 10 requests per second (enforced with a 100ms request throttle)
 * - 10-digit zero-padded CIK lookup via https://data.sec.gov/submissions/
 */

const SEC_USER_AGENT = process.env.SEC_USER_AGENT || 'InvestRadarAI admin@investradar.ai'
const SEC_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'

let tickerToCikMap: Map<string, string> | null = null
let lastRequestTime = 0

/**
 * Ensures a minimum of 100ms delay between consecutive requests to SEC EDGAR (max 10 req/sec).
 */
async function enforceRateLimit() {
  const now = Date.now()
  const timeSinceLast = now - lastRequestTime
  if (timeSinceLast < 100) {
    await new Promise((resolve) => setTimeout(resolve, 100 - timeSinceLast))
  }
  lastRequestTime = Date.now()
}

/**
 * Helper to fetch from SEC EDGAR with rate limiting and compliant User-Agent headers.
 */
async function secFetch(url: string) {
  await enforceRateLimit()

  const response = await fetch(url, {
    headers: {
      'User-Agent': SEC_USER_AGENT,
      'Accept-Encoding': 'gzip, deflate',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`SEC EDGAR API HTTP ${response.status}: ${response.statusText} (${url})`)
  }

  return response.json()
}

/**
 * Loads company_tickers.json from SEC and builds ticker -> 10-digit zero-padded CIK map.
 */
export async function getTickerToCikMap(): Promise<Map<string, string>> {
  if (tickerToCikMap) {
    return tickerToCikMap
  }

  const map = new Map<string, string>()

  try {
    const data = await secFetch(SEC_TICKERS_URL)
    // Structure of company_tickers.json:
    // { "0": { "cik_str": 320193, "ticker": "AAPL", "title": "Apple Inc." }, ... }
    Object.values(data).forEach((entry: any) => {
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

/**
 * Retrieves the 10-digit zero-padded CIK for a given stock ticker.
 */
export async function getCikForTicker(ticker: string): Promise<string | null> {
  const map = await getTickerToCikMap()
  return map.get(ticker.toUpperCase()) || null
}

export interface SecSubmission {
  cik: string
  entityType: string
  sic: string
  sicDescription: string
  name: string
  tickers: string[]
  exchanges: string[]
  filings: {
    recent: {
      accessionNumber: string[]
      filingDate: string[]
      reportDate: string[]
      acceptanceDateTime: string[]
      act: string[]
      form: string[]
      fileNumber: string[]
      filmNumber: string[]
      items: string[]
      size: number[]
      isXBRL: number[]
      isInlineXBRL: number[]
      primaryDocument: string[]
      primaryDocDescription: string[]
    }
  }
}

/**
 * Fetches recent submissions and filing history for a company by ticker.
 */
export async function getCompanySubmissions(ticker: string): Promise<SecSubmission | null> {
  const cik = await getCikForTicker(ticker)
  if (!cik) {
    console.warn(`No CIK found for ticker: ${ticker}`)
    return null
  }

  const url = `https://data.sec.gov/submissions/CIK${cik}.json`
  try {
    const data = await secFetch(url)
    return data as SecSubmission
  } catch (err) {
    console.error(`Error fetching SEC submissions for ${ticker} (CIK ${cik}):`, err)
    return null
  }
}

/**
 * Fetches all XBRL company facts (financial statements data) for a company by ticker.
 */
export async function getCompanyFacts(ticker: string): Promise<any | null> {
  const cik = await getCikForTicker(ticker)
  if (!cik) {
    return null
  }

  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`
  try {
    const data = await secFetch(url)
    return data
  } catch (err) {
    console.error(`Error fetching SEC company facts for ${ticker} (CIK ${cik}):`, err)
    return null
  }
}
