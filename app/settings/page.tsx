import GenericResearchPage from '@/components/GenericResearchPage'

export default function SettingsPage() {
  return (
    <GenericResearchPage
      title="Settings (ตั้งค่าบัญชีและระบบการแจ้งเตือน)"
      subtitle="จัดการโปรไฟล์ การแจ้งเตือนข่าวสาร และ API Keys"
      description="กำหนดค่าการตั้งค่าบัญชีส่วนตัว ปรับแต่งธีมการแสดงผล และเลือกรับข่าวสารบทวิเคราะห์ AI ทางอีเมลหรือระบบแจ้งเตือน"
      icon="⚙️"
    />
  )
}
