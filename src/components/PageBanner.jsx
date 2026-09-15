import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Link000 } from './ui/skiper-ui/skiper40'

export default function PageBanner({ title, subtitle, breadcrumbs = [] }) {
  const words = title.split(' ')
  const lastWord = words.pop()
  const firstPart = words.join(' ')

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(9,160,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(9,160,231,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-300/20 rounded-full blur-[100px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {breadcrumbs.length > 0 && (
          <motion.nav className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link000 href="/" className="hover:text-sky-600 transition-colors">Home</Link000>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-gray-300">/</span>
                {bc.path ? (
                  <Link000 href={bc.path} className="hover:text-sky-600 transition-colors">{bc.label}</Link000>
                ) : (
                  <span className="text-sky-500">{bc.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        <div className="overflow-hidden">
          <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 tracking-tight leading-[0.95] mb-5"
            initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {firstPart ? <>{firstPart.toUpperCase()} <span className="text-stroke-sky">{lastWord.toUpperCase()}</span></> : <span>{title.toUpperCase()}</span>}
          </motion.h1>
        </div>
        {subtitle && (
          <motion.p className="text-gray-500 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
