import Link from 'next/link'

export default function GenericResearchPage({
  title,
  subtitle,
  description,
  icon = '📊',
}: {
  title: string
  subtitle: string
  description: string
  icon?: string
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <span>←</span> กลับสู่หน้าหลัก (Dashboard)
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-bold">{title}</span>
        </nav>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-2xl text-indigo-400">
              {icon}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-700/60 pt-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
