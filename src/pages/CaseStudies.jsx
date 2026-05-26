import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function CaseStudies() {
  const { data: studies, loading } = useFirestoreCollection('case_studies', 'order')
  const active = studies.filter(s => s.active !== false)

  return (
    <PageTransition>
      <Helmet><title>Case Studies — Hiideals Technologies</title><meta name="description" content="Real projects, real results. See how we help businesses transform with technology." /></Helmet>

      <PageBanner title="Case Studies" subtitle="Real projects, real results. See how we help businesses transform with technology." breadcrumbs={[{ label: 'Case Studies' }]} />

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <SkeletonGrid count={3} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((cs, i) => (
                <motion.div key={cs.id} className="group rounded-2xl overflow-hidden transition-all duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(59,130,246,0.08)' }}>
                  {cs.image ? <img src={cs.image} alt={cs.title} className="w-full h-48 object-cover" loading="lazy" /> : <div className="w-full h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' }}><span className="text-4xl font-bold text-electric-500/30">{cs.title?.[0]}</span></div>}
                  <div className="p-6">
                    <span className="text-xs text-electric-400 font-semibold">{cs.client}</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-2">{cs.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{cs.description}</p>
                    {cs.results && <p className="text-xs font-semibold text-emerald-400 mb-3">{cs.results}</p>}
                    {cs.tech && <div className="flex flex-wrap gap-1 mb-4">{cs.tech.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px] text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}</div>}
                    <Link to={`/case-studies/${cs.slug || cs.id}`} className="text-sm text-electric-400 font-medium hover:text-electric-300">Read Case Study &rarr;</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
