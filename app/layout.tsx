import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvestRadar AI - แพลตฟอร์มวิเคราะห์หุ้นและวิจัยการลงทุนด้วย AI',
  description: 'แพลตฟอร์มวิเคราะห์ปัจจัยพื้นฐานหุ้น รายงานวิจัยการลงทุน และข้อมูลตลาดหุ้นขับเคลื่อนด้วยระบบปัญญาประดิษฐ์',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
