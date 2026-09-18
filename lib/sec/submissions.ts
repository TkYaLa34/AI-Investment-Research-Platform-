/**
 * Company Submissions Parser
 */

import { secClientFetch } from './client'
import { getCikForTicker } from './cik'

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

export async function getCompanySubmissions(ticker: string): Promise<SecSubmission | null> {
  const cik = await getCikForTicker(ticker)
  if (!cik) {
    return null
  }

  const url = `https://data.sec.gov/submissions/CIK${cik}.json`
  try {
    return await secClientFetch<SecSubmission>(url)
  } catch (err) {
    console.error(`Error fetching SEC submissions for ${ticker}:`, err)
    return null
  }
}
