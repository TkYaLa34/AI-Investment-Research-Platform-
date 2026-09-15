import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'
    const cleanSymbol = symbol.toUpperCase()

    const insights = {
      symbol: cleanSymbol,
      summary: `บทวิเคราะห์ AI ล่าสุดสำหรับ ${cleanSymbol}: มีแนวโน้มเชิงบวกจากผลประกอบการและปัจจัยพื้นฐานที่แข็งแกร่ง`,
      marketTrends: [
        `ความต้องการในกลุ่มธุรกิจหลักของ ${cleanSymbol} ยังคงเติบโตอย่างต่อเนื่อง`,
        'กระแสเงินทุนไหลเข้าจากนักลงทุนสถาบันในช่วงไตรมาสล่าสุด',
        'แนวโน้มราคาหุ้นสร้างฐานราคาเหนือเส้นเฉลี่ย 50 วัน (Moving Average)',
      ],
      riskAssessment: [
        'ความผันผวนจากนโยบายอัตราดอกเบี้ยและภาวะเศรษฐกิจมหภาค',
        'การแข่งขันที่สูงขึ้นในอุตสาหกรรมเทคโนโลยีและสินค้าผู้บริโภค',
      ],
      keyHighlights: [
        'อัตรากำไรขั้นต้น (Gross Margin) อยู่ในระดับสูงกว่าค่าเฉลี่ยอุตสาหกรรม',
        'มีกระแสเงินสดจากการดำเนินงานที่แข็งแกร่ง รองรับการลงทุนในอนาคต',
        'คะแนนความน่าสนใจทางการลงทุน (AI Score): 8.5/10',
      ],
    }

    return NextResponse.json({
      success: true,
      data: insights,
    })
  } catch (error: any) {
    console.error('API /api/insights Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}
