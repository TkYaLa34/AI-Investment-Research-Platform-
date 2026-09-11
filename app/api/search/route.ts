import { NextResponse } from 'next/server'
import { searchTickers } from '@/lib/finnhub'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ success: true, data: [] })
    }

    const results = await searchTickers(q)
    return NextResponse.json({ success: true, data: results })
  } catch (error: any) {
    console.error('API /api/search Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to execute ticker search' },
      { status: 500 }
    )
  }
}
