/**
 * Company XBRL Facts Parser
 */

import { secClientFetch } from './client'
import { getCikForTicker } from './cik'

export interface CompanyFacts {
  cik: number
  entityName: string
  facts: {
    'us-gaap'?: Record<string, {
      label: string
      description: string
      units: Record<string, Array<{
        end?: string
        val: number
        fy: number
        fp: string
        form: string
        filed: string
        frame?: string
      }>>
    }>
    dei?: Record<string, any>
  }
}

export async function getCompanyFacts(ticker: string): Promise<CompanyFacts | null> {
  const cik = await getCikForTicker(ticker)
  if (!cik) {
    return null
  }

  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`
  try {
    return await secClientFetch<CompanyFacts>(url)
  } catch (err) {
    console.error(`Error fetching SEC facts for ${ticker}:`, err)
    return null
  }
}
