import { NextResponse } from 'next/server'
import { getCompanySubmissions, getCikForTicker } from '@/lib/sec/edgar'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')

    if (!ticker || typeof ticker !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "ticker" query parameter' },
        { status: 400 }
      )
    }

    const cik = await getCikForTicker(ticker)
    if (!cik) {
      return NextResponse.json(
        { error: `No SEC CIK mapping found for ticker: ${ticker}` },
        { status: 404 }
      )
    }

    const submissions = await getCompanySubmissions(ticker)
    if (!submissions) {
      return NextResponse.json(
        { error: `Failed to fetch SEC submissions for ticker ${ticker} (CIK ${cik})` },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      ticker: ticker.toUpperCase(),
      cik,
      data: submissions,
    })
  } catch (error: any) {
    console.error('API /api/sec/submissions Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error fetching SEC submissions' },
      { status: 500 }
    )
  }
}
