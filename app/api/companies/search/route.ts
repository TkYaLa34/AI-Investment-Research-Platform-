import { NextResponse } from 'next/server'
import { searchTickers } from '@/lib/finnhub'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ success: true, data: [] })
    }

    const results = await searchTickers(query.trim())

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    console.error('API /api/companies/search Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to search companies' },
      { status: 500 }
    )
  }
}
