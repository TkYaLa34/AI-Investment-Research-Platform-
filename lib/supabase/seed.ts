import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export const MOCK_COMPANIES = [
  {
    id: 'c0010000-0000-0000-0000-000000000001',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
    market_cap: 3420000000000,
  },
  {
    id: 'c0020000-0000-0000-0000-000000000002',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    description: 'Microsoft Corporation develops and supports software, services, devices and solutions.',
    market_cap: 3150000000000,
  },
  {
    id: 'c0030000-0000-0000-0000-000000000003',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    description: 'NVIDIA Corporation designs graphics processing units (GPUs) for gaming, professional visualization, datacenter AI acceleration.',
    market_cap: 2850000000000,
  },
]

export const MOCK_STOCKS = [
  {
    id: 's0010000-0000-0000-0000-000000000001',
    company_id: 'c0010000-0000-0000-0000-000000000001',
    ticker: 'AAPL',
    asset_type: 'stock',
    current_price: 224.25,
    day_high: 226.10,
    day_low: 222.80,
    volume: 48500000,
    pe_ratio: 33.4,
    pb_ratio: 46.2,
    dividend_yield: 0.0044,
    valuation_metrics: { dcf_valuation: 210.0, ev_ebitda: 25.8 },
  },
  {
    id: 's0020000-0000-0000-0000-000000000002',
    company_id: 'c0020000-0000-0000-0000-000000000002',
    ticker: 'MSFT',
    asset_type: 'stock',
    current_price: 425.50,
    day_high: 428.90,
    day_low: 422.10,
    volume: 21300000,
    pe_ratio: 35.8,
    pb_ratio: 12.1,
    dividend_yield: 0.0071,
    valuation_metrics: { dcf_valuation: 440.0, ev_ebitda: 22.4 },
  },
  {
    id: 's0030000-0000-0000-0000-000000000003',
    company_id: 'c0030000-0000-0000-0000-000000000003',
    ticker: 'NVDA',
    asset_type: 'stock',
    current_price: 118.80,
    day_high: 121.50,
    day_low: 116.20,
    volume: 64200000,
    pe_ratio: 62.5,
    pb_ratio: 38.4,
    dividend_yield: 0.0003,
    valuation_metrics: { dcf_valuation: 125.0, ev_ebitda: 45.1 },
  },
]

export const MOCK_FINANCIALS = [
  {
    id: 'f0010000-0000-0000-0000-000000000001',
    company_id: 'c0010000-0000-0000-0000-000000000001',
    fiscal_year: 2023,
    fiscal_period: 'FY',
    revenue: 383285000000,
    net_income: 96995000000,
    total_assets: 352583000000,
    total_liabilities: 290437000000,
  },
  {
    id: 'f0020000-0000-0000-0000-000000000002',
    company_id: 'c0020000-0000-0000-0000-000000000002',
    fiscal_year: 2023,
    fiscal_period: 'FY',
    revenue: 211915000000,
    net_income: 72361000000,
    total_assets: 411976000000,
    total_liabilities: 205753000000,
  },
  {
    id: 'f0030000-0000-0000-0000-000000000003',
    company_id: 'c0030000-0000-0000-0000-000000000003',
    fiscal_year: 2024,
    fiscal_period: 'FY',
    revenue: 60922000000,
    net_income: 29760000000,
    total_assets: 65728000000,
    total_liabilities: 22750000000,
  },
]

export const MOCK_EARNINGS = [
  {
    id: 'e0010000-0000-0000-0000-000000000001',
    company_id: 'c0010000-0000-0000-0000-000000000001',
    fiscal_year: 2024,
    fiscal_quarter: 2,
    eps_actual: 1.53,
    eps_estimate: 1.50,
    revenue_actual: 90750000000,
    revenue_estimate: 90010000000,
    report_date: '2024-05-02',
  },
  {
    id: 'e0020000-0000-0000-0000-000000000002',
    company_id: 'c0020000-0000-0000-0000-000000000002',
    fiscal_year: 2024,
    fiscal_quarter: 3,
    eps_actual: 2.94,
    eps_estimate: 2.83,
    revenue_actual: 61860000000,
    revenue_estimate: 60800000000,
    report_date: '2024-04-25',
  },
  {
    id: 'e0030000-0000-0000-0000-000000000003',
    company_id: 'c0030000-0000-0000-0000-000000000003',
    fiscal_year: 2025,
    fiscal_quarter: 1,
    eps_actual: 0.61,
    eps_estimate: 0.55,
    revenue_actual: 26040000000,
    revenue_estimate: 24600000000,
    report_date: '2024-05-22',
  },
]

export const MOCK_SEC_FILINGS = [
  {
    id: 'sec0000-0000-0000-0000-000000000001',
    company_id: 'c0010000-0000-0000-0000-000000000001',
    filing_type: '10-K',
    filing_date: '2023-11-03',
    period_end_date: '2023-09-30',
    document_url: 'https://www.sec.gov/ix?doc=/Archives/edgar/data/0000320193/000032019323000106/aapl-20230930.htm',
    storage_path: 'sec-filings/aapl-2023-10k.pdf',
  },
  {
    id: 'sec0000-0000-0000-0000-000000000002',
    company_id: 'c0020000-0000-0000-0000-000000000002',
    filing_type: '10-K',
    filing_date: '2023-07-27',
    period_end_date: '2023-06-30',
    document_url: 'https://www.sec.gov/ix?doc=/Archives/edgar/data/0000789019/000078901923000032/msft-20230630.htm',
    storage_path: 'sec-filings/msft-2023-10k.pdf',
  },
  {
    id: 'sec0000-0000-0000-0000-000000000003',
    company_id: 'c0030000-0000-0000-0000-000000000003',
    filing_type: '10-K',
    filing_date: '2024-02-21',
    period_end_date: '2024-01-28',
    document_url: 'https://www.sec.gov/ix?doc=/Archives/edgar/data/0001045810/000104581024000029/nvda-20240128.htm',
    storage_path: 'sec-filings/nvda-2024-10k.pdf',
  },
]

export async function seedDatabase() {
  console.log('Seeding Supabase database with mock data...')

  const { error: companiesErr } = await supabase.from('companies').upsert(MOCK_COMPANIES as any)
  if (companiesErr) console.error('Error seeding companies:', companiesErr)

  const { error: stocksErr } = await supabase.from('stocks').upsert(MOCK_STOCKS as any)
  if (stocksErr) console.error('Error seeding stocks:', stocksErr)

  const { error: financialsErr } = await supabase.from('financials').upsert(MOCK_FINANCIALS as any)
  if (financialsErr) console.error('Error seeding financials:', financialsErr)

  const { error: earningsErr } = await supabase.from('earnings').upsert(MOCK_EARNINGS as any)
  if (earningsErr) console.error('Error seeding earnings:', earningsErr)

  const { error: secErr } = await supabase.from('sec_filings').upsert(MOCK_SEC_FILINGS as any)
  if (secErr) console.error('Error seeding SEC filings:', secErr)

  console.log('Database seeding finished!')
}
