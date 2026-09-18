# InvestRadar AI Platform - Core Development & Engineering Guidelines

This document outlines the core technical standards, conventions, and architectural best practices for developing and maintaining the **InvestRadar AI** platform.

---

## 1. Next.js (App Router), TypeScript, & Tailwind CSS Standards

### **Next.js App Router Architecture**
* **Server Components First:** Default to React Server Components (RSC) for data-fetching pages (`page.tsx`) to maximize performance, reduce client bundle size, and improve SEO.
* **Client Component Directives:** Explicitly add `'use client'` at the top of components that require state (`useState`), side effects (`useEffect`), browser APIs (`localStorage`, `window`), or event listeners (`onClick`, `onKeyDown`).
* **Dynamic Route Params:** In Next.js 15+, dynamic route parameters must be handled asynchronously using promises (e.g., `params: Promise<{ ticker: string }>`). Always `await params` before accessing properties.

### **TypeScript Type Safety**
* **Strict Typing:** Enable strict type checking (`"strict": true` in `tsconfig.json`). Avoid using `any` types; define explicit interfaces or types for API responses, database schemas, and component props.
* **Interface Exports:** Store global database and API types in `@/types/database.ts` or co-locate component-specific interfaces within their respective files.
* **Props Contracts:** Always define clear interface definitions for component props (e.g., `interface TickerSearchProps`).

### **Tailwind CSS & Responsive Styling**
* **Color Palette:** Stick to the platform's dark theme palette based on Slate (`slate-900`, `slate-800`, `slate-700`), Indigo/Cyan accents (`indigo-600`, `indigo-500`, `indigo-400`), Emerald for positive financial trends (`emerald-400`, `emerald-500`), and Rose for risk/negative trends (`rose-400`, `rose-500`).
* **Mobile-First Responsiveness:** Design mobile-first layouts using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`).
* **Text Truncation & Overflows:** Use `truncate`, `min-w-0`, and `overflow-x-auto` to prevent text overlap or horizontal scroll breakage on smaller viewports.

---

## 2. Robust Error Handling & Fetching Practices

### **Preventing Infinite Re-fetching Loops**
* **Stable Effect Dependencies:** Wrap async fetch functions in `useCallback` or ensure `useEffect` dependency arrays only depend on stable primitive variables (e.g., `activeSymbol`). Never place mutating objects or state setters directly into dependency arrays without memoization.
* **Mount State Guarding:** Include `isMounted` checks or cleanup functions in async `useEffect` calls to prevent state updates on unmounted components.

### **Handling HTTP Errors & API Failures (e.g., HTTP 500)**
* **Graceful Fallbacks:** Always handle network or HTTP status errors (e.g., HTTP 400, 500) inside `try...catch` blocks.
* **User-Friendly Error UI:** When an API request fails, render a clear, non-intrusive fallback state with localized Thai error explanations instead of endless loading spinners or blank screens.
* **Manual Retry Mechanism:** Provide an explicit **"ลองใหม่อีกครั้ง" (Retry)** button in error states allowing users to manually trigger a re-fetch rather than making automatic infinite retry requests.

---

## 3. Fundamental Financial Analysis & SEC Filings

### **Interpreting Primary SEC Filings (10-K, 10-Q, 8-K)**
* **10-K (Annual Reports):** Source for audited annual financial statements, comprehensive MD&A (Management's Discussion and Analysis), risk factors, and long-term debt schedules.
* **10-Q (Quarterly Reports):** Source for unaudited quarterly results, sequential performance shifts, and seasonal working capital changes.
* **8-K (Current Reports):** Source for material corporate events (earnings releases, executive changes, M&A, structural refinancing).

### **Key Metrics Mapping Standard**
* **Revenue (Total Net Sales):** Extracted directly from Income Statement top-line numbers.
* **Net Income (Net Earnings):** Extracted from bottom-line earnings after tax and operating expenses.
* **EPS (Diluted Earnings Per Share):** Map diluted EPS to account for stock-based compensation and convertible securities.
* **Free Cash Flow (FCF):** Calculated strictly as `Operating Cash Flow - Capital Expenditures (CapEx)`.

### **DCF Valuation Model Parameters**
* **Discount Rate (WACC):** Weighted Average Cost of Capital parameters should be explicit (typically 8.0% - 10.5% for mega-cap equities).
* **Terminal Growth Rate:** Long-term perpetual growth rate capped at sustainable GDP growth rates (typically 2.0% - 3.0%).
* **Margin of Safety:** Display intrinsic value comparison relative to current market price with clear discount/premium percentages.

### **Primary Source References & Disclosure Notes**
* Every financial data table or AI fundamental insight must include a direct link to the underlying SEC EDGAR document (e.g., `https://www.sec.gov/Archives/edgar/data/...`) or accession number reference.
* Provide clear disclosure notes when financial metrics are estimated, annualized, or derived from mock/fallback datasets.

---

## 4. Localization & Domain Conventions

* **Thai UI & English Terminology:** Interface labels, summaries, and instructions should be localized in professional Thai, while preserving standard English financial terms (e.g., *Common Stock, ETF, Gross Margin, Net Income, Free Cash Flow, Moving Average, P/E Ratio*).
* **Currency & Metrics:** Format monetary values clearly (e.g., `$125.50`, `$383.00B`) and include explicit sign indicators (`+` / `-`) for price performance badges.
