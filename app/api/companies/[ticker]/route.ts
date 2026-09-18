import { NextResponse } from 'next/server'
import { getCikForTicker } from '@/lib/sec/cik'
import { getCompanySubmissions } from '@/lib/sec/submissions'
import { getQuote } from '@/lib/finnhub'

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
    const cik = await getCikForTicker(cleanTicker)
    const submissions = await getCompanySubmissions(cleanTicker)
    const quote = await getQuote(cleanTicker)

    return NextResponse.json({
      success: true,
      data: {
        ticker: cleanTicker,
        cik,
        name: submissions?.name || cleanTicker,
        entityType: submissions?.entityType || 'Operating Company',
        sic: submissions?.sic || null,
        sicDescription: submissions?.sicDescription || null,
        exchanges: submissions?.exchanges || [],
        quote: {
          currentPrice: quote.c,
          change: quote.d,
          percentChange: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          previousClose: quote.pc,
        },
      },
    })
  } catch (error: any) {
    console.error('API /api/companies/[ticker] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch company overview' },
      { status: 500 }
    )
  }
}
