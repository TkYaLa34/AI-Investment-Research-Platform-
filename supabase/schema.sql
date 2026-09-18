-- Supabase SQL Schema Migration Script for InvestRadar AI
-- Uses safe DDL creation queries (CREATE TABLE IF NOT EXISTS) for companies, filings, financial_facts, and etfs.

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  description TEXT,
  market_cap NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Filings Table
CREATE TABLE IF NOT EXISTS public.filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  form TEXT NOT NULL,
  filing_date DATE NOT NULL,
  report_date DATE,
  accession_number TEXT UNIQUE NOT NULL,
  document_url TEXT,
  primary_doc_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Financial Facts Table
CREATE TABLE IF NOT EXISTS public.financial_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  fiscal_year INT NOT NULL,
  fiscal_period TEXT NOT NULL,
  revenue NUMERIC,
  net_income NUMERIC,
  operating_cash_flow NUMERIC,
  free_cash_flow NUMERIC,
  total_assets NUMERIC,
  total_debt NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_company_fiscal UNIQUE (company_id, fiscal_year, fiscal_period)
);

-- 4. Create ETFs Table
CREATE TABLE IF NOT EXISTS public.etfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT,
  aum NUMERIC,
  expense_ratio NUMERIC,
  holdings_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast query lookups
CREATE INDEX IF NOT EXISTS idx_filings_ticker ON public.filings(ticker);
CREATE INDEX IF NOT EXISTS idx_financial_facts_ticker ON public.financial_facts(ticker);
CREATE INDEX IF NOT EXISTS idx_etfs_symbol ON public.etfs(symbol);
