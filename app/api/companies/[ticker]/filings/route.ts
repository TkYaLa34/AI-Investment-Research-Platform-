import { NextResponse } from 'next/server'
import { getCikForTicker } from '@/lib/sec/cik'
import { getCompanySubmissions } from '@/lib/sec/submissions'

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

    const filingsList: Array<{
      accessionNumber: string
      form: string
      filingDate: string
      reportDate: string
      primaryDocDescription: string
      documentUrl?: string
    }> = []

    if (submissions?.filings?.recent) {
      const r = submissions.filings.recent
      const len = r.form?.length || 0

      for (let i = 0; i < len && filingsList.length < 15; i++) {
        const form = r.form[i]
        if (form === '10-K' || form === '10-Q' || form === '8-K' || form === '4') {
          const rawAccession = r.accessionNumber[i] || ''
          const cleanAccession = rawAccession.replace(/-/g, '')
          const primaryDoc = r.primaryDocument[i] || ''

          filingsList.push({
            accessionNumber: rawAccession,
            form,
            filingDate: r.filingDate[i] || '',
            reportDate: r.reportDate[i] || '',
            primaryDocDescription: r.primaryDocDescription[i] || form,
            documentUrl:
              cik && cleanAccession && primaryDoc
                ? `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${cleanAccession}/${primaryDoc}`
                : undefined,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      ticker: cleanTicker,
      cik,
      data: filingsList,
    })
  } catch (error: any) {
    console.error('API /api/companies/[ticker]/filings Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch SEC filings' },
      { status: 500 }
    )
  }
}
