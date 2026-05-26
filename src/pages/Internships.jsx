import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLocationMarker, HiClock, HiAcademicCap, HiLightBulb, HiUserGroup, HiCode } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const benefitCards = [
  { icon: HiCode, title: 'Real Projects', desc: 'Work on live products used by real customers.' },
  { icon: HiAcademicCap, title: 'Mentorship', desc: 'Learn from experienced senior developers.' },
  { icon: HiLightBulb, title: 'Skill Building', desc: 'Master modern tech stacks and best practices.' },
  { icon: HiUserGroup, title: 'Team Culture', desc: 'Be part of a collaborative, supportive team.' },
]

export default function Internships() {
  const { data: internships, loading } = useFirestoreCollection('internships', 'order')
  const active = internships.filter(i => i.active !== false)

  return (
    <PageTransition>
      <Helmet><title>Internships — Hiideals Technologies</title><meta name="description" content="Start your career with an internship at Hiideals Technologies." /></Helmet>

      <PageBanner title="Start Your Career" subtitle="Gain real-world experience through our internship programs." breadcrumbs={[{ label: 'Internships' }]} />

      {/* Benefits */}
      <section className="relative py-16 sm:py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefitCards.map((card, i) => (
              <motion.div key={i} className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                <card.icon className="w-8 h-8 text-electric-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-1.5">{card.title}</h4>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Listings */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-white mb-6 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Open Internships</motion.h2>

          {loading ? <SkeletonGrid count={2} cols={1} /> : active.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500">No open internships right now. Check back soon!</p></div>
          ) : (
            <div className="space-y-4">
              {active.map((intern, i) => (
                <motion.div key={intern.id} className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.15)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{intern.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiClock className="w-4 h-4" /> {intern.duration}</span>
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiLocationMarker className="w-4 h-4" /> {intern.location}</span>
                        {intern.stipend && <span className="text-sm text-emerald-400">{intern.stipend}</span>}
                      </div>
                      {intern.requirements && <div className="flex flex-wrap gap-1.5 mt-3">{intern.requirements.slice(0, 3).map(r => <span key={r} className="px-2 py-0.5 rounded text-xs text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{r}</span>)}</div>}
                    </div>
                    <Link to={`/internships/${intern.id}`} className="inline-flex px-5 py-2.5 rounded-xl text-white text-sm font-medium shrink-0 transition-all hover:-translate-y-0.5"
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
