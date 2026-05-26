import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PageBanner({ title, subtitle, breadcrumbs = [] }) {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.04)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {breadcrumbs.length > 0 && (
          <motion.nav
            className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="hover:text-electric-400 transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-gray-700">/</span>
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-electric-400 transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-gray-400">{bc.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
