import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvestRadar AI - Stock Research & Analytics',
  description: 'AI-driven financial research, fundamental stock analysis, and market insights platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
