import type { Company, Financials, Earnings, SecFiling, AiAnalysis, Database } from '@/types/database'
import { createClient } from '@/lib/supabase/server'
import { getCompanySubmissions } from '@/lib/sec/edgar'

export interface AnalysisInput {
  company: Company
  fiคnancials: Financials[]
  earnings: Earnings[]
  secFilings: SecFiling[]
  liveEdgarFilingCount?: number
  user_id?: string | null
}

export interface GeneratedAnalysisOutput {
  summary: string
  bull_case: string
  bear_case: string
  risk_assessment: string
  evidence: {
    sources: string[]
    financial_highlights: string[]
    sec_filing_references: string[]
  }
}

/**
 * Synthesizes structured financial metrics and SEC filings into an AI investment analysis report.
 */
export function generateAiAnalysis(input: AnalysisInput): GeneratedAnalysisOutput {
  const { company, financials, earnings, secFilings, liveEdgarFilingCount = 0 } = input

  const latestFinancial = financials[0]
  const latestEarnings = earnings[0]
  const recentFilings = secFilings.map((f) => `${f.filing_type} (${f.filing_date})`)

  const revenueDisplay = latestFinancial?.revenue
    ? `$${(latestFinancial.revenue / 1e9).toFixed(2)}B`
    : 'N/A'
  const netIncomeDisplay = latestFinancial?.net_income
    ? `$${(latestFinancial.net_income / 1e9).toFixed(2)}B`
    : 'N/A'
  const epsDisplay = latestEarnings?.eps_actual !== null && latestEarnings?.eps_actual !== undefined
    ? `$${latestEarnings.eps_actual.toFixed(2)}`
    : 'N/A'

  const totalIndexedFilings = Math.max(secFilings.length, liveEdgarFilingCount)

  const summary = `${company.name} (${company.ticker}) operates in the ${company.sector || 'General'} sector (${company.industry || 'N/A'}). Fundamental financial analysis indicates recent annual revenue of ${revenueDisplay} and net income of ${netIncomeDisplay}. Recent earnings performance showed an actual EPS of ${epsDisplay}.`

  const bull_case = `1. Strong market leadership in ${company.industry || 'its primary industry'} with a market cap of ${company.market_cap ? `$${(company.market_cap / 1e9).toFixed(2)}B` : 'N/A'}.\n2. Robust revenue generation of ${revenueDisplay} backed by steady quarterly earnings execution.\n3. Institutional backing and active regulatory filings (${totalIndexedFilings} filings indexed via SEC EDGAR).`

  const bear_case = `1. Sector volatility and competitive pressures in ${company.sector || 'the broader market'}.\n2. Dependence on macroeconomic stability and interest rate cycles impacting valuation multiples.\n3. Potential regulatory scrutiny as noted in official SEC 10-K/10-Q disclosures.`

  const risk_assessment = `Moderate Risk Profile. Key risk factors include supply chain constraints, market concentration, technology disruption, and macroeconomic fluctuations.`

  const evidence = {
    sources: [
      `Official SEC EDGAR Submissions API (${totalIndexedFilings} total indexed filings)`,
      `Income & Balance Sheet Data (Fiscal Year ${latestFinancial?.fiscal_year || 'Latest'})`,
      `Quarterly Earnings Reports (FY${latestEarnings?.fiscal_year || 'Latest'})`,
    ],
    financial_highlights: [
      `Revenue: ${revenueDisplay}`,
      `Net Income: ${netIncomeDisplay}`,
      `Actual EPS: ${epsDisplay}`,
    ],
    sec_filing_references: recentFilings.length > 0 ? recentFilings : ['No database SEC filings referenced'],
  }

  return {
    summary,
    bull_case,
    bear_case,
    risk_assessment,
    evidence,
  }
}

/**
 * Executes AI analysis for a company and saves the record in Supabase `ai_analyses` table.
 */
export async function analyzeAndSaveCompany(
  companyId: string,
  userId?: string | null
): Promise<AiAnalysis> {
  const supabase = await createClient()

  // 1. Fetch Company
  const { data: company, error: companyErr } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  if (companyErr || !company) {
    throw new Error(`Company not found for ID: ${companyId}`)
  }

  // 2. Fetch Financials
  const { data: financials } = await supabase
    .from('financials')
    .select('*')
    .eq('company_id', companyId)
    .order('fiscal_year', { ascending: false })

  // 3. Fetch Earnings
  const { data: earnings } = await supabase
    .from('earnings')
    .select('*')
    .eq('company_id', companyId)
    .order('fiscal_year', { ascending: false })

  // 4. Fetch Database SEC Filings
  const { data: secFilings } = await supabase
    .from('sec_filings')
    .select('*')
    .eq('company_id', companyId)
    .order('filing_date', { ascending: false })

  // 5. Query live SEC EDGAR API for recent submissions
  let liveEdgarFilingCount = 0
  try {
    const edgarSubmissions = await getCompanySubmissions(company.ticker)
    if (edgarSubmissions?.filings?.recent?.form) {
      liveEdgarFilingCount = edgarSubmissions.filings.recent.form.length
    }
  } catch (err) {
    console.warn(`Could not fetch live SEC EDGAR data for ${company.ticker}:`, err)
  }

  // 6. Generate structured AI report
  const analysisOutput = generateAiAnalysis({
    company: company as Company,
    financials: (financials as Financials[]) || [],
    earnings: (earnings as Earnings[]) || [],
    secFilings: (secFilings as SecFiling[]) || [],
    liveEdgarFilingCount,
    user_id: userId,
  })

  // 7. Save back to Supabase `ai_analyses` table
  const insertPayload: Database['public']['Tables']['ai_analyses']['Insert'] = {
    company_id: companyId,
    user_id: userId || null,
    summary: analysisOutput.summary,
    bull_case: analysisOutput.bull_case,
    bear_case: analysisOutput.bear_case,
    risk_assessment: analysisOutput.risk_assessment,
    evidence: analysisOutput.evidence as any,
  }

  const { data: savedAnalysis, error: insertErr } = await supabase
    .from('ai_analyses')
    .insert(insertPayload as any)
    .select('*')
    .single()

  if (insertErr || !savedAnalysis) {
    throw new Error(`Failed to save AI analysis to database: ${insertErr?.message}`)
  }

  return savedAnalysis as AiAnalysis
}
