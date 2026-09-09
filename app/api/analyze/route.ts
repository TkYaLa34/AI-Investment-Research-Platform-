import { NextResponse } from 'next/server'
import { analyzeAndSaveCompany } from '@/lib/ai/analyzer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { company_id, user_id } = body || {}

    if (!company_id || typeof company_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "company_id" parameter' },
        { status: 400 }
      )
    }

    const savedAnalysis = await analyzeAndSaveCompany(company_id, user_id)

    return NextResponse.json({
      success: true,
      data: savedAnalysis,
    })
  } catch (error: any) {
    console.error('API /api/analyze Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error during AI analysis' },
      { status: 500 }
    )
  }
}
