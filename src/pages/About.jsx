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
const valueColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

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
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Our Mission', text: 'To empower businesses with innovative, reliable, and scalable software solutions that transform ideas into impactful digital experiences.' },
              { title: 'Our Vision', text: 'To become the most trusted software partner for businesses in India and beyond, known for quality, innovation, and integrity.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `rgba(59,130,246,0.1)` }}>
                  {i === 0 ? <HiLightBulb className="w-5 h-5 text-electric-400" /> : <HiEye className="w-5 h-5 text-electric-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Values" title="What We Stand For" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fallbackValues.map((val, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              const color = valueColors[i % valueColors.length]
              return (
                <motion.div key={i} className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: `0 20px 40px -10px ${color}15` }}>
                  <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: `${color}12`, border: `1px solid ${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h4 className="font-semibold text-white mb-1.5">{val.title}</h4>
                  <p className="text-sm text-gray-500">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0e1a, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Team" title="Meet the People Behind Hiideals" />
          {teamLoading ? <SkeletonGrid count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTeam.map((member, i) => (
                <motion.div key={member.id} className="group text-center p-8 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}>
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' }}>
                    {member.photo ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-2xl font-bold text-electric-400">{member.name?.[0]}</span>}
                  </div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{member.role}</p>
                  {member.bio && <p className="text-xs text-gray-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{member.bio}</p>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-electric-400 hover:underline">LinkedIn</a>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Company Timeline */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Journey" title="Company Timeline" />
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] sm:-translate-x-px" />
            {[
              { year: general?.founded || '2015', title: 'Founded', desc: 'Hiideals Technologies started in Bidar, Karnataka.' },
              { year: '2018', title: 'First Product', desc: 'Launched our first SaaS product for local businesses.' },
              { year: '2021', title: 'Team Growth', desc: 'Expanded our team and started serving clients nationwide.' },
              { year: '2024', title: 'National Reach', desc: 'Multiple products live, serving clients across India.' },
            ].map((item, i) => (
              <motion.div key={i} className={`relative flex gap-6 mb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-electric-500 border-2 border-navy-900 -translate-x-1.5 sm:-translate-x-1.5 mt-1.5 z-10" />
                <div className={`ml-10 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                  <span className="text-electric-400 font-bold text-sm">{item.year}</span>
                  <h4 className="text-white font-semibold mt-1">{item.title}</h4>
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
