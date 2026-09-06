# Data Model: InvestRadar AI

## 1. Core Entities
* **User:** User profiles and account preferences.
* **Company:** Fundamental corporate data (Ticker, Name, Sector, Industry).
* **Stock / ETF:** Market metadata, pricing, and valuation metrics.
* **Financials:** Balance sheets, income statements, and cash flows.
* **Earnings:** Quarterly and annual performance metrics.
* **SEC Filings:** Metadata and storage references for official filings (10-K, 10-Q).
* **AI Analysis & Evidence:** Generated insights linked to specific evidentiary sources.
* **Watchlist:** User-specific tracking lists for stocks and ETFs.

## 2. Security & Compliance
* **Row Level Security (RLS):** Enforced on user-specific tables (e.g., Watchlists, User Profiles) to ensure strict data privacy.
* **Storage Buckets:** Secure Supabase Storage buckets configured for raw SEC filing documents and PDF reports.
