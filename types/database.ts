export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  preferences: Json | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  ticker: string
  name: string
  sector: string | null
  industry: string | null
  description: string | null
  market_cap: number | null
  created_at: string
  updated_at: string
}

export interface Stock {
  id: string
  company_id: string | null
  ticker: string
  asset_type: 'stock' | 'etf' | string
  current_price: number | null
  day_high: number | null
  day_low: number | null
  volume: number | null
  pe_ratio: number | null
  pb_ratio: number | null
  dividend_yield: number | null
  valuation_metrics: Json | null
  updated_at: string
}

export interface Financials {
  id: string
  company_id: string
  fiscal_year: number
  fiscal_period: string
  balance_sheet: Json | null
  income_statement: Json | null
  cash_flow: Json | null
  revenue: number | null
  net_income: number | null
  total_assets: number | null
  total_liabilities: number | null
  created_at: string
}

export interface Earnings {
  id: string
  company_id: string
  fiscal_year: number
  fiscal_quarter: number | null
  eps_actual: number | null
  eps_estimate: number | null
  revenue_actual: number | null
  revenue_estimate: number | null
  report_date: string | null
  metrics: Json | null
  created_at: string
}

export interface SecFiling {
  id: string
  company_id: string
  filing_type: '10-K' | '10-Q' | string
  filing_date: string
  period_end_date: string | null
  document_url: string | null
  storage_path: string | null
  metadata: Json | null
  created_at: string
}

export interface AiAnalysis {
  id: string
  company_id: string
  user_id: string | null
  summary: string | null
  bull_case: string | null
  bear_case: string | null
  risk_assessment: string | null
  evidence: Json | null
  created_at: string
  updated_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  company_id: string | null
  ticker: string
  added_at: string
  notes: string | null
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<User>
      }
      companies: {
        Row: Company
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Company>
      }
      stocks: {
        Row: Stock
        Insert: Omit<Stock, 'id' | 'updated_at'> & {
          id?: string
          updated_at?: string
        }
        Update: Partial<Stock>
      }
      financials: {
        Row: Financials
        Insert: Omit<Financials, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Financials>
      }
      earnings: {
        Row: Earnings
        Insert: Omit<Earnings, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Earnings>
      }
      sec_filings: {
        Row: SecFiling
        Insert: Omit<SecFiling, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<SecFiling>
      }
      ai_analyses: {
        Row: AiAnalysis
        Insert: Omit<AiAnalysis, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<AiAnalysis>
      }
      watchlists: {
        Row: Watchlist
        Insert: Omit<Watchlist, 'id' | 'added_at'> & {
          id?: string
          added_at?: string
        }
        Update: Partial<Watchlist>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
