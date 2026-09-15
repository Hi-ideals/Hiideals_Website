import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiLightBulb, HiShieldCheck, HiEye, HiHeart, HiGlobe, HiSparkles } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import SectionHeading from '../components/SectionHeading'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const valueIcons = [HiLightBulb, HiShieldCheck, HiEye, HiHeart, HiGlobe, HiSparkles]
const valueColors = ['text-sky-500', 'text-violet-500', 'text-cyan-500', 'text-emerald-500', 'text-amber-500', 'text-rose-500']
const valueBgs = ['bg-sky-50', 'bg-violet-50', 'bg-cyan-50', 'bg-emerald-50', 'bg-amber-50', 'bg-rose-50']

const fallbackValues = [
  { title: 'Innovation', desc: 'Pushing boundaries with modern tech' },
  { title: 'Quality', desc: 'Clean code, tested deliverables' },
  { title: 'Transparency', desc: 'Honest communication, always' },
  { title: 'Client First', desc: 'Your success drives our work' },
]

export default function About() {
  const { data: general } = useFirestoreDoc('site_settings', 'general')
  const { data: team, loading: teamLoading } = useFirestoreCollection('team', 'order')
  const activeTeam = team.filter(m => m.active !== false)

  return (
    <PageTransition>
      <Helmet><title>About — Hiideals Technologies</title><meta name="description" content="Learn about Hiideals Technologies — our mission, vision, team, and values." /></Helmet>
      <PageBanner title="About Us" subtitle="A passionate team of engineers and designers based in Bidar, Karnataka — building software that matters." breadcrumbs={[{ label: 'About' }]} />

      {/* Mission & Vision */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Our Mission', text: general?.mission || 'To empower businesses with innovative, reliable, and scalable software solutions that transform ideas into impactful digital experiences.' },
              { title: 'Our Vision', text: general?.vision || 'To become the most trusted software partner for businesses in India and beyond, known for quality, innovation, and integrity.' },
            ].map((item, i) => (
              <motion.div key={i} className="group p-8 sm:p-10 rounded-2xl bg-sky-50/50 border border-sky-100/80 hover:bg-white hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200 transition-all duration-500"
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-sky-100 group-hover:bg-sky-500 group-hover:scale-110 transition-all duration-300">
                  {i === 0 ? <HiLightBulb className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors" /> : <HiEye className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors" />}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">{item.title.toUpperCase()}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Values" title="What We Stand For" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fallbackValues.map((val, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              return (
                <motion.div key={i} className="group p-7 rounded-2xl text-center bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${valueBgs[i % valueBgs.length]}`}>
                    <Icon className={`w-6 h-6 ${valueColors[i % valueColors.length]}`} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{val.title}</h4>
                  <p className="text-sm text-gray-500">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Team" title="Meet the People Behind Hiideals" />
          {teamLoading ? <SkeletonGrid count={3} /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {activeTeam.map((member, i) => (
                <motion.div key={member.id}
                  className="group text-center transition-all duration-400 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-4">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-sm" />
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-3 ring-sky-100 group-hover:ring-sky-300 transition-all duration-400 shadow-md group-hover:shadow-lg group-hover:shadow-sky-200/40">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-sky-500">{member.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-sky-100 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{member.name}</h3>
                  <p className="text-xs sm:text-sm text-sky-600 font-medium mt-0.5">{member.role}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Journey" title="Company Timeline" />
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-sky-200 sm:-translate-x-px" />
            {[
              { year: general?.founded || '2015', title: 'Founded', desc: 'Hiideals Technologies started in Bidar, Karnataka.' },
              { year: '2018', title: 'First Product', desc: 'Launched our first SaaS product for local businesses.' },
              { year: '2021', title: 'Team Growth', desc: 'Expanded our team and started serving clients nationwide.' },
              { year: '2024', title: 'National Reach', desc: 'Multiple products live, serving clients across India.' },
            ].map((item, i) => (
              <motion.div key={i} className={`relative flex gap-6 mb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-sky-500 border-3 border-white -translate-x-2 sm:-translate-x-2 mt-1.5 z-10 shadow-lg shadow-sky-500/25" />
                <div className={`ml-10 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                  <span className="text-sky-600 font-black text-sm uppercase tracking-wider">{item.year}</span>
                  <h4 className="text-gray-900 font-bold text-lg mt-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
