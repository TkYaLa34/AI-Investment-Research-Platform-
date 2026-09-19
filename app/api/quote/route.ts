import { NextResponse } from 'next/server'
import { getQuote } from '@/lib/finnhub'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol || typeof symbol !== 'string' || !symbol.trim()) {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter "symbol"' },
        { status: 400 }
      )
    }

    const quote = await getQuote(symbol)

    return NextResponse.json({
      success: true,
      symbol: symbol.toUpperCase(),
      data: {
        currentPrice: quote.c,
        change: quote.d,
        percentChange: quote.dp,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc,
      },
    })
  } catch (error: any) {
    console.error('API /api/quote Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch quote data' },
      { status: 500 }
    )
  }
}
