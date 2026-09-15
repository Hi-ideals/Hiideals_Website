import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLocationMarker, HiClock, HiAcademicCap, HiLightBulb, HiUserGroup, HiCode, HiArrowRight } from 'react-icons/hi'
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

const cardColors = ['text-sky-500', 'text-violet-500', 'text-amber-500', 'text-emerald-500']
const cardBgs = ['bg-sky-50', 'bg-violet-50', 'bg-amber-50', 'bg-emerald-50']

export default function Internships() {
  const { data: internships, loading } = useFirestoreCollection('internships', 'order')
  const active = internships.filter(i => i.active !== false)

  return (
    <PageTransition>
      <Helmet><title>Internships — Hiideals Technologies</title><meta name="description" content="Start your career with an internship at Hiideals Technologies." /></Helmet>

      <PageBanner title="Start Your Career" subtitle="Gain real-world experience through our internship programs." breadcrumbs={[{ label: 'Internships' }]} />

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[120px] -translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefitCards.map((card, i) => (
              <motion.div key={i} className="group p-7 rounded-2xl text-center bg-sky-50/50 border border-sky-100/80 hover:bg-white hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200 hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${cardBgs[i]}`}>
                  <card.icon className={`w-6 h-6 ${cardColors[i]}`} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{card.title}</h4>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">Programs</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[0.95]">
              OPEN <span className="text-stroke-sky">INTERNSHIPS.</span>
            </motion.h2>
          </div>

          {loading ? <SkeletonGrid count={2} cols={1} /> : active.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500">No open internships right now. Check back soon!</p></div>
          ) : (
            <div className="space-y-4">
              {active.map((intern, i) => (
                <motion.div key={intern.id} className="group p-6 rounded-2xl bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-0.5 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{intern.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiClock className="w-4 h-4" /> {intern.duration}</span>
                        <span className="flex items-center gap-1 text-sm text-gray-500"><HiLocationMarker className="w-4 h-4" /> {intern.location}</span>
                        {intern.stipend && <span className="text-sm text-emerald-600 font-bold">{intern.stipend}</span>}
                      </div>
                      {intern.requirements && <div className="flex flex-wrap gap-1.5 mt-3">{intern.requirements.slice(0, 3).map(r => <span key={r} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">{r}</span>)}</div>}
                    </div>
                    <Link to={`/internships/${intern.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-bold uppercase tracking-wider shrink-0 transition-all bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25">Apply Now <HiArrowRight className="w-3.5 h-3.5" /></Link>
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
