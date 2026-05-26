import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import { SkeletonBlock, SkeletonLine } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const { data: studies, loading } = useFirestoreCollection('case_studies', 'order')
  const cs = studies.find(s => s.slug === slug || s.id === slug)

  if (loading) return (
    <div className="min-h-screen pt-32 px-4" style={{ background: '#050816' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonLine className="w-32 h-4" />
        <SkeletonLine className="w-2/3 h-8" />
        <SkeletonBlock className="h-64" />
        <SkeletonLine className="w-full h-4" />
        <SkeletonLine className="w-4/5 h-4" />
      </div>
    </div>
  )

  if (!cs) return (
    <PageTransition>
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Case Study Not Found</h2>
          <Link to="/case-studies" className="text-electric-400 hover:underline">Back to Case Studies</Link>
        </div>
      </div>
    </PageTransition>
  )

  return (
    <PageTransition>
      <Helmet><title>{cs.title} — Hiideals Technologies</title><meta name="description" content={cs.description} /></Helmet>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.nav className="flex items-center gap-2 text-xs text-gray-500 mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className="hover:text-electric-400">Home</Link><span className="text-gray-700">/</span>
            <Link to="/case-studies" className="hover:text-electric-400">Case Studies</Link><span className="text-gray-700">/</span>
            <span className="text-gray-400">{cs.title}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-electric-400 font-semibold text-sm">{cs.client}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-2 mb-4 tracking-tight">{cs.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{cs.description}</p>
            {cs.tech && <div className="flex flex-wrap gap-2 mt-5">{cs.tech.map(t => <span key={t} className="px-3 py-1 rounded-lg text-xs font-medium text-gray-300" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>)}</div>}
          </motion.div>
        </div>
      </section>

      {cs.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <img src={cs.image} alt={cs.title} className="w-full rounded-2xl border border-white/[0.06]" loading="lazy" />
        </div>
      )}

      {/* Content */}
      <section className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {cs.challenge && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-white mb-3">The Challenge</h2>
              <p className="text-gray-400 leading-relaxed">{cs.challenge}</p>
            </motion.div>
          )}
          {cs.solution && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-white mb-3">Our Solution</h2>
              <p className="text-gray-400 leading-relaxed">{cs.solution}</p>
            </motion.div>
          )}
          {cs.results && (
            <motion.div className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.04))', border: '1px solid rgba(16,185,129,0.1)' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <p className="text-emerald-300 font-semibold text-lg">{cs.results}</p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div className="text-center pt-8 border-t border-white/[0.06]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-xl font-bold text-white mb-3">Want similar results?</h3>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.2)' }}>
              Start Your Project <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
