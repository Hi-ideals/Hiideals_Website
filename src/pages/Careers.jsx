import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLocationMarker, HiBriefcase, HiUserGroup, HiGlobe, HiAcademicCap, HiSparkles } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const whyCards = [
  { icon: HiSparkles, title: 'Innovation First', desc: 'Work on cutting-edge technologies and real-world products.' },
  { icon: HiUserGroup, title: 'Great Team', desc: 'Collaborate with talented engineers and designers.' },
  { icon: HiGlobe, title: 'Remote Friendly', desc: 'Work from anywhere — we believe in flexibility.' },
  { icon: HiAcademicCap, title: 'Learn & Grow', desc: 'Continuous learning with mentorship and resources.' },
]

export default function Careers() {
  const { data: jobs, loading } = useFirestoreCollection('careers', 'order')
  const activeJobs = jobs.filter(j => j.active !== false)
  const [filter, setFilter] = useState('All')

  const types = ['All', ...new Set(activeJobs.map(j => j.type).filter(Boolean))]
  const filtered = filter === 'All' ? activeJobs : activeJobs.filter(j => j.type === filter)

  return (
    <PageTransition>
      <Helmet><title>Careers — Hiideals Technologies</title><meta name="description" content="Join our team. Explore open positions at Hiideals Technologies." /></Helmet>

      <PageBanner title="Join Our Team" subtitle="We're always looking for talented people who share our passion for building great software." breadcrumbs={[{ label: 'Careers' }]} />

      {/* Why Work With Us */}
      <section className="relative py-16 sm:py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyCards.map((card, i) => (
              <motion.div key={i} className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}>
                <card.icon className="w-8 h-8 text-electric-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-1.5">{card.title}</h4>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-white mb-6 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Open Positions</motion.h2>

          {types.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {types.map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === t ? 'bg-electric-500/10 text-electric-400 border border-electric-500/20' : 'text-gray-500 border border-white/[0.06] hover:text-white'}`}>{t}</button>
              ))}
            </div>
          )}

          {loading ? <SkeletonGrid count={3} cols={1} /> : filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500">No open positions at the moment. Check back soon!</p></div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job, i) => (
                <motion.div key={job.id} className="p-6 rounded-2xl transition-all duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.15)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiBriefcase className="w-4 h-4" /> {job.type}</span>
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiLocationMarker className="w-4 h-4" /> {job.location}</span>
                        {job.department && <span className="text-sm text-gray-500">{job.department}</span>}
                      </div>
                    </div>
                    <Link to={`/careers/${job.id}`} className="inline-flex px-5 py-2.5 rounded-xl text-white text-sm font-medium shrink-0 transition-all hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>Apply Now</Link>
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
