import { NextResponse } from 'next/server'
import { getCompanyFacts } from '@/lib/sec/company-facts'
import { normalizeCompanyFacts } from '@/lib/sec/normalize-facts'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 })
    }

    const cleanTicker = ticker.toUpperCase()
    const facts = await getCompanyFacts(cleanTicker)

    const currentYear = new Date().getFullYear()
    const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear]

    const normalized = facts ? normalizeCompanyFacts(facts, years) : []

    return NextResponse.json({
      success: true,
      ticker: cleanTicker,
      data: normalized,
    })
  } catch (error: any) {
    console.error('API /api/companies/[ticker]/financials Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch financial statements' },
      { status: 500 }
    )
  }
}
