import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiCode, HiDeviceMobile, HiCloud, HiShieldCheck, HiDatabase, HiCog, HiArrowRight, HiSearch, HiTemplate, HiCubeTransparent, HiUpload } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const iconMap = { code: HiCode, mobile: HiDeviceMobile, cloud: HiCloud, shield: HiShieldCheck, database: HiDatabase, ai: HiCog, design: HiTemplate, analytics: HiDatabase, cog: HiCog }
const colors = ['text-sky-500', 'text-violet-500', 'text-cyan-500', 'text-emerald-500', 'text-amber-500', 'text-rose-500']
const bgs = ['bg-sky-50', 'bg-violet-50', 'bg-cyan-50', 'bg-emerald-50', 'bg-amber-50', 'bg-rose-50']
const dots = ['bg-sky-400', 'bg-violet-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400']
const accents = ['border-sky-400', 'border-violet-400', 'border-cyan-400', 'border-emerald-400', 'border-amber-400', 'border-rose-400']

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

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <SkeletonGrid count={6} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeServices.map((service, i) => {
                const Icon = iconMap[service.icon] || HiCode
                return (
                  <motion.div key={service.id} className="group relative p-7 rounded-2xl bg-sky-50/50 border border-sky-100/80 hover:bg-white hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200 hover:-translate-y-1 transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${bgs[i % bgs.length]}`}>
                      <Icon className={`w-6 h-6 ${colors[i % colors.length]}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2.5">{service.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-2">
                        {service.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2.5 text-sm text-gray-500">
                            <span className={`w-1 h-1 rounded-full shrink-0 ${dots[i % dots.length]}`} />{f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className={`absolute bottom-0 left-7 right-7 h-[3px] rounded-full ${accents[i % accents.length]} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">How We Work</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95]">
              OUR <span className="text-stroke-sky">PROCESS.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, i) => (
              <motion.div key={i} className="relative text-center p-7 rounded-2xl bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white bg-sky-500 shadow-lg shadow-sky-500/25">{i + 1}</div>
                <step.icon className="w-8 h-8 text-sky-500 mx-auto mb-4 mt-3" />
                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="relative rounded-[2rem] p-10 sm:p-16 lg:p-20 overflow-hidden bg-sky-500"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-sky-400/50 blur-[80px]" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.95] mb-5">
                NEED A CUSTOM <span className="text-sky-200">SOLUTION?</span>
              </h2>
              <p className="text-sky-100 mb-8 text-base sm:text-lg">Tell us about your project and we'll get back to you with a free consultation and quote.</p>
              <Link to="/contact" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider text-sky-600 bg-white hover:bg-sky-50 transition-all shadow-lg">
                Get a Free Quote <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
