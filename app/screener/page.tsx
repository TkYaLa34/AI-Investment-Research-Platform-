import GenericResearchPage from '@/components/GenericResearchPage'

export default function ScreenerPage() {
  return (
    <GenericResearchPage
      title="Stock Screener (คัดกรองหุ้นปัจจัยพื้นฐาน)"
      subtitle="คัดกรองหุ้นตามเงื่อนไข P/E, P/B, Dividend Yield, และ ROE"
      description="เครื่องมือค้นหาและคัดกรองหุ้นเชิงลึกตามอัตราส่วนทางการเงิน อัตราการเติบโตของรายได้ และมูลค่าทางบัญชี เพื่อค้นหาบริษัทที่มีศักยภาพการเติบโตสูง"
      icon="🔍"
    />
  )
}
