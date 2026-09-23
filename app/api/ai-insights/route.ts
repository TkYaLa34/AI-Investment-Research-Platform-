import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'
    const cleanSymbol = symbol.toUpperCase()

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Fallback structured AI response when OPENAI_API_KEY is not configured
      return NextResponse.json({
        success: true,
        source: 'fallback',
        data: {
          symbol: cleanSymbol,
          summary: `บทวิเคราะห์ AI สำหรับ ${cleanSymbol}: ปัจจัยพื้นฐานเติบโตอย่างมั่นคงและมีแรงหนุนเชิงเทคนิค`,
          marketTrends: [
            `ความต้องการในกลุ่มสินค้าและบริการหลักของ ${cleanSymbol} ยังขยายตัวต่อเนื่อง`,
            'สถาบันการเงินและกองทุนรวมเพิ่มสัดส่วนการถือครองในไตรมาสล่าสุด',
            'โครงสร้างราคาสร้างฐานเหนือแนวรับสำคัญอย่างแข็งแกร่ง',
          ],
          riskAssessment: [
            'ความผันผวนของอัตราดอกเบี้ยและสภาวะเศรษฐกิจมหภาค',
            'ความเสี่ยงจากการแข่งขันในอุตสาหกรรมและต้นทุนการดำเนินงาน',
          ],
          keyHighlights: [
            'อัตรากำไรขั้นต้น (Gross Margin) อยู่ในระดับสูงเหนือค่าเฉลี่ยกลุ่ม',
            'กระแสเงินสดจากการดำเนินงานแข็งแกร่ง รองรับการปันผลและการลงทุน',
            'คะแนนความน่าสนใจทางการลงทุน (AI Score): 8.8/10',
          ],
        },
      })
    }

    const openai = new OpenAI({ apiKey })

    const prompt = `คุณคือผู้เชี่ยวชาญการวิเคราะห์หุ้นสถาบันระดับโลก โปรดวิเคราะห์หุ้นหรือ ETF ชื่อย่อ "${cleanSymbol}"
ให้คำตอบเป็น JSON ในรูปแบบนี้เท่านั้น:
{
  "summary": "สรุปสั้นๆ 1 ประโยคภาษาไทยเกี่ยวกับภาพรวมและแนวโน้มของ ${cleanSymbol}",
  "marketTrends": ["แนวโน้มตลาดข้อ 1", "แนวโน้มตลาดข้อ 2", "แนวโน้มตลาดข้อ 3"],
  "riskAssessment": ["ความเสี่ยงข้อ 1", "ความเสี่ยงข้อ 2"],
  "keyHighlights": ["ไฮไลท์ข้อ 1", "ไฮไลท์ข้อ 2", "ไฮไลท์ข้อ 3"]
}
ใช้ภาษาไทยที่เป็นทางการ ผสมผสานกับคำศัพท์การเงินภาษาอังกฤษมาตรฐาน (เช่น Gross Margin, Moving Average, P/E Ratio)`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial analyst assistant providing structured JSON responses in Thai.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const text = response.choices[0]?.message?.content || ''
    const parsed = JSON.parse(text)

    return NextResponse.json({
      success: true,
      source: 'gpt-4o-mini',
      data: {
        symbol: cleanSymbol,
        summary: parsed.summary,
        marketTrends: parsed.marketTrends,
        riskAssessment: parsed.riskAssessment,
        keyHighlights: parsed.keyHighlights,
      },
    })
  } catch (error: any) {
    console.error('API /api/ai-insights Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}
