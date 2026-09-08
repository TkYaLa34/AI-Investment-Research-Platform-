-- Supabase SQL Seed Script for InvestRadar AI
-- Populates mock records for companies, stocks, financials, earnings, and sec_filings.

-- 1. Insert Companies
INSERT INTO public.companies (id, ticker, name, sector, industry, description, market_cap, created_at, updated_at)
VALUES
  (
    'c0010000-0000-0000-0000-000000000001',
    'AAPL',
    'Apple Inc.',
    'Technology',
    'Consumer Electronics',
    'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    3420000000000,
    NOW(),
    NOW()
  ),
  (
    'c0020000-0000-0000-0000-000000000002',
    'MSFT',
    'Microsoft Corporation',
    'Technology',
    'Software - Infrastructure',
    'Microsoft Corporation develops and supports software, services, devices and solutions including Azure cloud services, Windows, and Office productivity suites.',
    3150000000000,
    NOW(),
    NOW()
  ),
  (
    'c0030000-0000-0000-0000-000000000003',
    'NVDA',
    'NVIDIA Corporation',
    'Technology',
    'Semiconductors',
    'NVIDIA Corporation designs graphics processing units (GPUs) for gaming, professional visualization, datacenter AI acceleration, and automotive systems.',
    2850000000000,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  ticker = EXCLUDED.ticker,
  name = EXCLUDED.name,
  sector = EXCLUDED.sector,
  industry = EXCLUDED.industry,
  description = EXCLUDED.description,
  market_cap = EXCLUDED.market_cap,
  updated_at = NOW();

-- 2. Insert Stocks / Market Data
INSERT INTO public.stocks (id, company_id, ticker, asset_type, current_price, day_high, day_low, volume, pe_ratio, pb_ratio, dividend_yield, valuation_metrics, updated_at)
VALUES
  (
    's0010000-0000-0000-0000-000000000001',
    'c0010000-0000-0000-0000-000000000001',
    'AAPL',
    'stock',
    224.25,
    226.10,
    222.80,
    48500000,
    33.4,
    46.2,
    0.0044,
    '{"dcf_valuation": 210.0, "ev_ebitda": 25.8}',
    NOW()
  ),
  (
    's0020000-0000-0000-0000-000000000002',
    'c0020000-0000-0000-0000-000000000002',
    'MSFT',
    'stock',
    425.50,
    428.90,
    422.10,
    21300000,
    35.8,
    12.1,
    0.0071,
    '{"dcf_valuation": 440.0, "ev_ebitda": 22.4}',
    NOW()
  ),
  (
    's0030000-0000-0000-0000-000000000003',
    'c0030000-0000-0000-0000-000000000003',
    'NVDA',
    'stock',
    118.80,
    121.50,
    116.20,
    64200000,
    62.5,
    38.4,
    0.0003,
    '{"dcf_valuation": 125.0, "ev_ebitda": 45.1}',
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  current_price = EXCLUDED.current_price,
  day_high = EXCLUDED.day_high,
  day_low = EXCLUDED.day_low,
  volume = EXCLUDED.volume,
  pe_ratio = EXCLUDED.pe_ratio,
  pb_ratio = EXCLUDED.pb_ratio,
  dividend_yield = EXCLUDED.dividend_yield,
  updated_at = NOW();

-- 3. Insert Financial Statements
INSERT INTO public.financials (id, company_id, fiscal_year, fiscal_period, revenue, net_income, total_assets, total_liabilities, created_at)
VALUES
  (
    'f0010000-0000-0000-0000-000000000001',
    'c0010000-0000-0000-0000-000000000001',
    2023,
    'FY',
    383285000000,
    96995000000,
    352583000000,
    290437000000,
    NOW()
  ),
  (
    'f0020000-0000-0000-0000-000000000002',
    'c0020000-0000-0000-0000-000000000002',
    2023,
    'FY',
    211915000000,
    72361000000,
    411976000000,
    205753000000,
    NOW()
  ),
  (
    'f0030000-0000-0000-0000-000000000003',
    'c0030000-0000-0000-0000-000000000003',
    2024,
    'FY',
    60922000000,
    29760000000,
    65728000000,
    22750000000,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Earnings Performance
INSERT INTO public.earnings (id, company_id, fiscal_year, fiscal_quarter, eps_actual, eps_estimate, revenue_actual, revenue_estimate, report_date, created_at)
VALUES
  (
    'e0010000-0000-0000-0000-000000000001',
    'c0010000-0000-0000-0000-000000000001',
    2024,
    2,
    1.53,
    1.50,
    90750000000,
    90010000000,
    '2024-05-02',
    NOW()
  ),
  (
    'e0020000-0000-0000-0000-000000000002',
    'c0020000-0000-0000-0000-000000000002',
    2024,
    3,
    2.94,
    2.83,
    61860000000,
    60800000000,
    '2024-04-25',
    NOW()
  ),
  (
    'e0030000-0000-0000-0000-000000000003',
    'c0030000-0000-0000-0000-000000000003',
    2025,
    1,
    0.61,
    0.55,
    26040000000,
    24600000000,
    '2024-05-22',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert SEC Filings
INSERT INTO public.sec_filings (id, company_id, filing_type, filing_date, period_end_date, document_url, storage_path, created_at)
VALUES
  (
    'sec0000-0000-0000-0000-000000000001',
    'c0010000-0000-0000-0000-000000000001',
    '10-K',
    '2023-11-03',
    '2023-09-30',
    'https://www.sec.gov/ix?doc=/Archives/edgar/data/0000320193/000032019323000106/aapl-20230930.htm',
    'sec-filings/aapl-2023-10k.pdf',
    NOW()
  ),
  (
    'sec0000-0000-0000-0000-000000000002',
    'c0020000-0000-0000-0000-000000000002',
    '10-K',
    '2023-07-27',
    '2023-06-30',
    'https://www.sec.gov/ix?doc=/Archives/edgar/data/0000789019/000078901923000032/msft-20230630.htm',
    'sec-filings/msft-2023-10k.pdf',
    NOW()
  ),
  (
    'sec0000-0000-0000-0000-000000000003',
    'c0030000-0000-0000-0000-000000000003',
    '10-K',
    '2024-02-21',
    '2024-01-28',
    'https://www.sec.gov/ix?doc=/Archives/edgar/data/0001045810/000104581024000029/nvda-20240128.htm',
    'sec-filings/nvda-2024-10k.pdf',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
