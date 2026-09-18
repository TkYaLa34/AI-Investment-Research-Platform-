/**
 * XBRL Facts Normalizer
 *
 * Maps multiple US-GAAP XBRL concepts (Revenue, Net Income, EPS, Total Assets, Total Debt, Operating Cash Flow, CapEx)
 * into clean normalized annual financial metrics without duplicating values or using fake numbers.
 */

import { CompanyFacts } from './company-facts'

export interface NormalizedFinancialYear {
  fiscalYear: number
  revenue: number | null // USD
  netIncome: number | null // USD
  dilutedEps: number | null // USD
  operatingCashFlow: number | null // USD
  capEx: number | null // USD
  freeCashFlow: number | null // USD
  totalAssets: number | null // USD
  totalDebt: number | null // USD
}

const REVENUE_CONCEPTS = [
  'Revenues',
  'SalesRevenueNet',
  'RevenueFromContractWithCustomerExcludingAssessedTax',
  'SalesRevenueGoodsNet',
]

const NET_INCOME_CONCEPTS = [
  'NetIncomeLoss',
  'ProfitLoss',
  'NetIncomeLossAvailableToCommonStockholdersBasic',
]

const EPS_CONCEPTS = [
  'EarningsPerShareDiluted',
  'EarningsPerShareBasic',
]

const OCF_CONCEPTS = [
  'NetCashProvidedByUsedInOperatingActivities',
]

const CAPEX_CONCEPTS = [
  'PaymentsToAcquirePropertyPlantAndEquipment',
  'PaymentsToAcquireProductiveAssets',
]

const ASSETS_CONCEPTS = [
  'Assets',
]

const DEBT_CONCEPTS = [
  'LongTermDebtAndCapitalLeaseObligations',
  'LongTermDebtNoncurrent',
  'DebtLongtermAndShorttermCombinedAmount',
]

function extractAnnualFactValue(
  facts: CompanyFacts['facts']['us-gaap'],
  conceptNames: string[],
  year: number
): number | null {
  if (!facts) return null

  for (const concept of conceptNames) {
    const factObj = facts[concept]
    if (!factObj || !factObj.units) continue

    const unitKeys = Object.keys(factObj.units)
    for (const unitKey of unitKeys) {
      const entries = factObj.units[unitKey]
      const annualEntries = entries.filter(
        (e) => e.fy === year && (e.fp === 'FY' || e.form === '10-K') && typeof e.val === 'number'
      )

      if (annualEntries.length > 0) {
        // Pick the entry filed most recently
        annualEntries.sort((a, b) => (b.filed || '').localeCompare(a.filed || ''))
        return annualEntries[0].val
      }
    }
  }

  return null
}

export function normalizeCompanyFacts(facts: CompanyFacts, targetYears: number[]): NormalizedFinancialYear[] {
  const gaapFacts = facts?.facts?.['us-gaap']
  const result: NormalizedFinancialYear[] = []

  for (const year of targetYears) {
    const revenue = extractAnnualFactValue(gaapFacts, REVENUE_CONCEPTS, year)
    const netIncome = extractAnnualFactValue(gaapFacts, NET_INCOME_CONCEPTS, year)
    const dilutedEps = extractAnnualFactValue(gaapFacts, EPS_CONCEPTS, year)
    const operatingCashFlow = extractAnnualFactValue(gaapFacts, OCF_CONCEPTS, year)
    const capEx = extractAnnualFactValue(gaapFacts, CAPEX_CONCEPTS, year)
    const totalAssets = extractAnnualFactValue(gaapFacts, ASSETS_CONCEPTS, year)
    const totalDebt = extractAnnualFactValue(gaapFacts, DEBT_CONCEPTS, year)

    const freeCashFlow =
      operatingCashFlow !== null && capEx !== null ? operatingCashFlow - Math.abs(capEx) : null

    result.push({
      fiscalYear: year,
      revenue,
      netIncome,
      dilutedEps,
      operatingCashFlow,
      capEx,
      freeCashFlow,
      totalAssets,
      totalDebt,
    })
  }

  return result
}
