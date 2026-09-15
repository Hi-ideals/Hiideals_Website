import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HiArrowRight, HiCode, HiDeviceMobile, HiCloud, HiShieldCheck, HiDatabase, HiCog, HiStar, HiEye } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import ProductModal from '../components/ProductModal'
import AnimatedCounter from '../components/AnimatedCounter'
import HeroBackground from '../components/HeroBackground'
import HeroVisual from '../components/HeroVisual'
import TypewriterText from '../components/TypewriterText'
import { SkeletonGrid } from '../components/Skeleton'
import { Link000, Link001 } from '../components/ui/skiper-ui/skiper40'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'

const iconMap = { code: HiCode, mobile: HiDeviceMobile, cloud: HiCloud, shield: HiShieldCheck, database: HiDatabase, ai: HiCog, design: HiCog, analytics: HiDatabase, cog: HiCog }

const serviceColors = [
  { iconBg: 'bg-sky-100', iconColor: 'text-sky-600', accent: 'border-sky-400' },
  { iconBg: 'bg-violet-100', iconColor: 'text-violet-600', accent: 'border-violet-400' },
  { iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600', accent: 'border-cyan-400' },
  { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', accent: 'border-emerald-400' },
  { iconBg: 'bg-amber-100', iconColor: 'text-amber-600', accent: 'border-amber-400' },
  { iconBg: 'bg-rose-100', iconColor: 'text-rose-600', accent: 'border-rose-400' },
]

const textReveal = {
  hidden: { opacity: 0, y: 80 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function Home() {
  const { data: homepage } = useFirestoreDoc('site_settings', 'homepage')
  const { data: general } = useFirestoreDoc('site_settings', 'general')
  const { data: seo } = useFirestoreDoc('site_settings', 'seo')
  const { data: services, loading: svcLoading } = useFirestoreCollection('services', 'order')
  const { data: products, loading: prodLoading } = useFirestoreCollection('products', 'order')
  const { data: testimonials, loading: testLoading } = useFirestoreCollection('testimonials', 'order')
  const { data: blogPosts, loading: blogLoading } = useFirestoreCollection('blog_posts', 'createdAt')
  const { data: clientLogos } = useFirestoreCollection('client_logos', 'order')

  const activeServices = services.filter(s => s.active !== false)
  const activeProducts = products.filter(p => p.active !== false)
  const activeTestimonials = testimonials.filter(t => t.active !== false)
  const activeBlogs = blogPosts.filter(p => p.published !== false && p.active !== false).slice(0, 3)

  const showServices = homepage?.showServices !== false
  const showProducts = homepage?.showProducts !== false
  const showTestimonials = homepage?.showTestimonials !== false
  const showBlog = homepage?.showBlog !== false
  const showClients = homepage?.showClients !== false
  const showCTA = homepage?.showCTA !== false

  const [currentTest, setCurrentTest] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const timerRef = useRef()
  useEffect(() => {
    if (activeTestimonials.length <= 1) return
    timerRef.current = setInterval(() => setCurrentTest(p => (p + 1) % activeTestimonials.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [activeTestimonials.length])

  const pauseCarousel = () => clearInterval(timerRef.current)
  const resumeCarousel = () => {
    if (activeTestimonials.length <= 1) return
    timerRef.current = setInterval(() => setCurrentTest(p => (p + 1) % activeTestimonials.length), 4000)
  }

  const formatDate = (d) => {
    if (!d) return ''
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const heroStats = [
    { value: 120, suffix: '+', label: 'Clients Served' },
    { value: 100, suffix: '+', label: 'Projects Delivered' },
    { value: 20, suffix: '+', label: 'Products Built' },
    { value: parseInt(general?.founded) || 2015, suffix: '', label: 'Since', isYear: true },
  ]

  const statsRef = useRef(null)
  const { scrollYProgress: statsScroll } = useScroll({ target: statsRef, offset: ['start end', 'end start'] })
  const statsY = useTransform(statsScroll, [0, 1], [60, -60])

  return (
    <PageTransition>
      <Helmet>
        <title>{seo?.metaTitle || 'Hiideals Technologies — Software Solutions'}</title>
        <meta name="description" content={seo?.metaDescription || 'Hiideals Technologies delivers innovative software solutions from Bidar, Karnataka.'} />
        {seo?.ogImage && <meta property="og:image" content={seo.ogImage} />}
      </Helmet>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden -mt-20 lg:-mt-24 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
                className="float-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7 sm:mb-9 bg-gradient-to-r from-sky-500/10 via-sky-400/15 to-sky-500/10 border border-sky-300/50 backdrop-blur-sm shadow-sm shadow-sky-200/30">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-sky-700 to-sky-500 bg-clip-text text-transparent">
                  {homepage?.heroBadge || 'Software Company in Bidar, Karnataka'}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-2">
                <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.5rem] font-black text-gray-900 leading-[0.95] tracking-tight">
                  {homepage?.heroTitle1 || 'WE BUILD'}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-5 sm:mb-6">
                <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.5rem] font-black leading-[0.95] tracking-tight">
                  <TypewriterText text={homepage?.heroTitle2 || 'SOFTWARE.'} delay={1400} speed={65} className="gradient-text" />
                </motion.h1>
              </div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
                className="text-sm sm:text-base lg:text-lg text-gray-500 mb-8 sm:mb-10 max-w-xl leading-relaxed">
                {homepage?.heroDescription || 'We craft premium digital experiences — from enterprise platforms to mobile apps and cloud infrastructure. Based in Bidar, serving clients worldwide.'}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7 }} className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="hero-glow-btn group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base text-white font-bold bg-sky-500 hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                  <span className="relative">START YOUR PROJECT</span>
                  <HiArrowRight className="relative w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                <Link to="/products" className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold text-gray-700 hover:text-sky-600 transition-all duration-300 underline underline-offset-4 decoration-gray-300 hover:decoration-sky-400">
                  SEE WORK
                  <HiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              </motion.div>
            </div>

            <motion.div className="hidden lg:block relative"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section ref={statsRef} className="relative py-14 sm:py-20 overflow-hidden bg-sky-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
        <motion.div style={{ y: statsY }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4">
            {heroStats.map((stat) => (
              <motion.div key={stat.label} className="text-center"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  {stat.isYear ? <span>{stat.value}</span> : <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000} />}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sky-100 font-semibold mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ CLIENTS MARQUEE ═══════════════ */}
      {showClients && (clientLogos?.length > 0) && (
        <section className="relative overflow-hidden bg-white border-b border-sky-100 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gray-300">Trusted By</p>
          </div>
          <div className="group relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex items-center animate-marquee group-hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center shrink-0">
                  {clientLogos.map((client, i) => (
                    <div key={`${setIdx}-${i}`} className="flex items-center gap-3 shrink-0 mx-8 sm:mx-12 group/item hover:scale-105 transition-transform duration-300 cursor-default">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="h-12 sm:h-14 max-w-[140px] sm:max-w-[180px] object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500" />
                      ) : (
                        <span className="text-sm sm:text-[15px] font-bold text-gray-300 group-hover/item:text-gray-500 whitespace-nowrap transition-colors duration-300">{client.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ SERVICES ═══════════════ */}
      {showServices && (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
              <div>
                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">Services</motion.span>
                <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95]">
                  WHAT<br /><span className="text-stroke-sky">WE DO.</span>
                </motion.h2>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="lg:pt-12">
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                  End-to-end software solutions engineered for performance and scale. From web apps to cloud infrastructure — we build what your business needs.
                </p>
              </motion.div>
            </div>

            {svcLoading ? <SkeletonGrid count={4} cols={3} /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeServices.slice(0, 6).map((service, i) => {
                  const Icon = iconMap[service.icon] || HiCode
                  const colors = serviceColors[i % serviceColors.length]
                  return (
                    <motion.div key={service.id}
                      className={`group relative p-7 rounded-2xl bg-sky-50/50 border border-sky-100/80 hover:bg-white hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200 hover:-translate-y-1 transition-all duration-500`}
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                      <div className={`absolute bottom-0 left-7 right-7 h-[3px] rounded-full ${colors.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                    </motion.div>
                  )
                })}
              </div>
            )}
            <motion.div className="mt-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link000 href="/services" className="text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-sky-600 transition-colors">
                View All Services
              </Link000>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ PRODUCTS ═══════════════ */}
      {showProducts && activeProducts.length > 0 && (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">Our Products</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95]">
                BUILT TO <span className="text-stroke-sky">SOLVE.</span>
              </motion.h2>
            </div>

            {prodLoading ? <SkeletonGrid count={3} cols={3} /> : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProducts.slice(0, 6).map((product, i) => (
                    <motion.div key={product.id}
                      className="group rounded-2xl overflow-hidden bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                      {product.image && (
                        <div className="relative h-52 overflow-hidden bg-sky-50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                          {product.status && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-600">{product.status}</span>}
                        </div>
                        {product.tagline && <p className="text-sky-600 font-medium text-sm mb-2">{product.tagline}</p>}
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{product.description}</p>
                        {product.tech && <div className="flex flex-wrap gap-1.5 mb-4">{product.tech.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">{t}</span>)}</div>}
                        <button onClick={() => setSelectedProduct(product)} className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-sky-600 transition-colors group/btn">
                          <HiEye className="w-4 h-4" /> View Details <HiArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {activeProducts.length > 6 && (
                  <div className="text-center mt-14">
                    <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all">
                      View All Products <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      {showTestimonials && activeTestimonials.length > 0 && (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[130px]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">Testimonials</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95]">
                REAL <span className="text-stroke-sky">RESULTS.</span>
              </motion.h2>
            </div>

            <div className="relative" onMouseEnter={pauseCarousel} onMouseLeave={resumeCarousel}>
              <div className="overflow-hidden">
                {activeTestimonials.map((t, i) => (
                  <motion.div key={t.id} className={`${i === currentTest ? 'block' : 'hidden'}`}
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: i === currentTest ? 1 : 0, x: i === currentTest ? 0 : 50 }} transition={{ duration: 0.4 }}>
                    <div className="text-center p-10 sm:p-16 rounded-3xl bg-sky-50/50 border border-sky-100">
                      <div className="flex justify-center mb-5">
                        {Array.from({ length: 5 }, (_, j) => <HiStar key={j} className={`w-5 h-5 ${j < (t.rating || 5) ? 'text-sky-400' : 'text-gray-200'}`} />)}
                      </div>
                      <p className="text-gray-700 text-xl sm:text-2xl leading-relaxed mb-8 font-medium max-w-3xl mx-auto">"{t.content}"</p>
                      <div className="flex items-center justify-center gap-4">
                        {t.photo ? <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-3 ring-sky-200" loading="lazy" /> : <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-lg">{t.name?.[0]}</div>}
                        <div className="text-left">
                          <p className="font-bold text-gray-900">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.role}{t.company ? ` at ${t.company}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {activeTestimonials.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 mt-8">
                  {activeTestimonials.map((_, i) => (
                    <button key={i} onClick={() => setCurrentTest(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentTest ? 'bg-sky-500 w-8' : 'bg-gray-200 hover:bg-gray-300 w-2'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ BLOG ═══════════════ */}
      {showBlog && activeBlogs.length > 0 && (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
              <div>
                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-4 block">Blog</motion.span>
                <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95]">
                  LATEST <span className="text-stroke-sky">INSIGHTS.</span>
                </motion.h2>
              </div>
              <Link000 href="/blog" className="text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-sky-600 transition-colors shrink-0">
                View All
              </Link000>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBlogs.map((post, i) => (
                <motion.article key={post.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="relative h-48 overflow-hidden">
                    {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center bg-sky-50"><span className="text-6xl font-black text-sky-200">H</span></div>}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.author && <><span>&bull;</span><span>{post.author}</span></>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link000 href={`/blog/${post.slug || post.id}`} className="text-sm font-bold text-sky-600 hover:text-sky-700 uppercase tracking-wider">Read More</Link000>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      {showCTA && (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="relative rounded-[2rem] p-10 sm:p-16 lg:p-24 overflow-hidden bg-sky-500"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-sky-400/50 blur-[80px]" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-[60px]" />
              <div className="relative text-center max-w-3xl mx-auto">
                <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
                  READY TO BUILD<br />SOMETHING <span className="text-sky-200">GREAT?</span>
                </motion.h2>
                <p className="text-sky-100 mb-10 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">Let's discuss how we can bring your ideas to life with technology that scales.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider text-sky-600 bg-white hover:bg-sky-50 transition-all shadow-lg">
                    Get Started <HiArrowRight className="w-4 h-4" />
                  </Link>
                  <a href={`https://wa.me/${(general?.phone || '919999999999').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider text-white border-2 border-white/30 hover:bg-white/10 transition-all">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </PageTransition>
  )
}
