import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiCode, HiDeviceMobile, HiCloud, HiShieldCheck, HiDatabase, HiCog, HiArrowRight, HiSearch, HiTemplate, HiCubeTransparent, HiUpload } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const iconMap = { code: HiCode, mobile: HiDeviceMobile, cloud: HiCloud, shield: HiShieldCheck, database: HiDatabase, ai: HiCog, design: HiTemplate, analytics: HiDatabase, cog: HiCog }
const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const processSteps = [
  { icon: HiSearch, title: 'Discovery', desc: 'We understand your business, goals, and challenges through in-depth consultation.' },
  { icon: HiTemplate, title: 'Design', desc: 'We create wireframes, prototypes, and visual designs tailored to your needs.' },
  { icon: HiCubeTransparent, title: 'Build', desc: 'Our engineers develop robust, scalable solutions with clean code and testing.' },
  { icon: HiUpload, title: 'Deploy', desc: 'We deploy, monitor, and provide ongoing support to ensure success.' },
]

export default function Services() {
  const { data: services, loading } = useFirestoreCollection('services', 'order')
  const activeServices = services.filter(s => s.active !== false)

  return (
    <PageTransition>
      <Helmet><title>Services — Hiideals Technologies</title><meta name="description" content="End-to-end software services — web development, mobile apps, cloud, cybersecurity and more." /></Helmet>

      <PageBanner title="Our Services" subtitle="End-to-end software services designed to accelerate your business." breadcrumbs={[{ label: 'Services' }]} />

      {/* Services Grid */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <SkeletonGrid count={6} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeServices.map((service, i) => {
                const Icon = iconMap[service.icon] || HiCode
                const color = colors[i % colors.length]
                return (
                  <motion.div key={service.id} className="group p-7 rounded-2xl transition-all duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                    initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -8, boxShadow: `0 25px 50px -12px ${color}15` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
                      style={{ background: `${color}12`, border: `1px solid ${color}15` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2.5">{service.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-2">
                        {service.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2.5 text-sm text-gray-500">
                            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />{f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Our Process */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.12)' }}>How We Work</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Our Process</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, i) => (
              <motion.div key={i} className="relative text-center p-6 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{i + 1}</div>
                <step.icon className="w-8 h-8 text-electric-400 mx-auto mb-4 mt-3" />
                <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Quote CTA */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: '#050816' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">Need a Custom Solution?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Tell us about your project and we'll get back to you with a free consultation and quote.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}>
              Get a Free Quote <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
