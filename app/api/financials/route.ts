import { NextResponse } from 'next/server'
import { getFinancialsData } from '@/lib/financials'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'
    const cleanSymbol = symbol.toUpperCase()

    const financials = await getFinancialsData(cleanSymbol)

    return NextResponse.json({
      success: true,
      data: financials,
    })
  } catch (error: any) {
    console.error('API /api/financials Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch financials data' },
      { status: 500 }
    )
  }
}
