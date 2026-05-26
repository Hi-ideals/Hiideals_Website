import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HiArrowRight, HiCode, HiDeviceMobile, HiCloud, HiShieldCheck, HiDatabase, HiCog, HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import AnimatedCounter from '../components/AnimatedCounter'
import HeroBackground from '../components/HeroBackground'
import TypewriterText from '../components/TypewriterText'
import { SkeletonGrid, SkeletonCard } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'

const iconMap = { code: HiCode, mobile: HiDeviceMobile, cloud: HiCloud, shield: HiShieldCheck, database: HiDatabase, ai: HiCog, design: HiCog, analytics: HiDatabase, cog: HiCog }

const serviceColors = [
  { gradient: 'from-blue-500/20 to-cyan-500/5', border: 'hover:border-blue-500/30', iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20', iconColor: 'text-blue-400' },
  { gradient: 'from-purple-500/20 to-pink-500/5', border: 'hover:border-purple-500/30', iconBg: 'bg-purple-500/10 group-hover:bg-purple-500/20', iconColor: 'text-purple-400' },
  { gradient: 'from-cyan-500/20 to-blue-500/5', border: 'hover:border-cyan-500/30', iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20', iconColor: 'text-cyan-400' },
  { gradient: 'from-emerald-500/20 to-cyan-500/5', border: 'hover:border-emerald-500/30', iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { gradient: 'from-amber-500/20 to-orange-500/5', border: 'hover:border-amber-500/30', iconBg: 'bg-amber-500/10 group-hover:bg-amber-500/20', iconColor: 'text-amber-400' },
  { gradient: 'from-rose-500/20 to-pink-500/5', border: 'hover:border-rose-500/30', iconBg: 'bg-rose-500/10 group-hover:bg-rose-500/20', iconColor: 'text-rose-400' },
]

export default function Home() {
  const { data: homepage } = useFirestoreDoc('site_settings', 'homepage')
  const { data: general } = useFirestoreDoc('site_settings', 'general')
  const { data: seo } = useFirestoreDoc('site_settings', 'seo')
  const { data: services, loading: svcLoading } = useFirestoreCollection('services', 'order')
  const { data: products, loading: prodLoading } = useFirestoreCollection('products', 'order')
  const { data: testimonials, loading: testLoading } = useFirestoreCollection('testimonials', 'order')
  const { data: caseStudies, loading: csLoading } = useFirestoreCollection('case_studies', 'order')
  const { data: blogPosts, loading: blogLoading } = useFirestoreCollection('blog_posts', 'createdAt')

  const activeServices = services.filter(s => s.active !== false)
  const activeProducts = products.filter(p => p.active !== false)
  const activeTestimonials = testimonials.filter(t => t.active !== false)
  const activeCaseStudies = caseStudies.filter(c => c.active !== false).slice(0, 3)
  const activeBlogs = blogPosts.filter(p => p.published !== false && p.active !== false).slice(0, 3)

  const showServices = homepage?.showServices !== false
  const showProducts = homepage?.showProducts !== false
  const showTestimonials = homepage?.showTestimonials !== false
  const showBlog = homepage?.showBlog !== false
  const showCareers = homepage?.showCareers !== false

  // Testimonial carousel
  const [currentTest, setCurrentTest] = useState(0)
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
    { value: 50, suffix: '+', label: 'Clients' },
    { value: 100, suffix: '+', label: 'Projects' },
    { value: 10, suffix: '+', label: 'Products' },
    { value: parseInt(general?.founded) || 2015, suffix: '', label: 'Since', isYear: true },
  ]

  return (
    <PageTransition>
      <Helmet>
        <title>{seo?.metaTitle || 'Hiideals Technologies — Software Solutions'}</title>
        <meta name="description" content={seo?.metaDescription || 'Hiideals Technologies delivers innovative software solutions from Bidar, Karnataka.'} />
        {seo?.ogImage && <meta property="og:image" content={seo.ogImage} />}
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center overflow-hidden py-16 sm:py-20">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 sm:mb-8"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(59,130,246,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-electric-400">
                {homepage?.heroBadge || 'Software Company in Bidar, Karnataka'}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 sm:mb-6 tracking-tight">
              {homepage?.heroTitle1 || 'We Build Software'}<br />
              <TypewriterText text={homepage?.heroTitle2 || 'That Drives Growth'} delay={1400} speed={65} className="gradient-text" />
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl leading-relaxed">
              {homepage?.heroDescription || 'We craft premium digital experiences — from enterprise platforms to mobile apps and cloud infrastructure. Based in Bidar, serving clients worldwide.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base text-white font-semibold overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.35)]"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.25)' }}>
                <span className="relative z-10">Start a Project</span>
                <HiArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/case-studies" className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-gray-300 transition-all duration-500 hover:-translate-y-1 hover:text-white hover:bg-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                View Our Work
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
          <motion.div className="w-[1px] h-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.5), transparent)' }}>
            <motion.div className="w-full h-4 bg-electric-400" animate={{ y: [-16, 48] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {heroStats.map((stat, i) => (
              <motion.div key={stat.label} className="relative text-center py-6 px-4 rounded-2xl group cursor-default"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.04)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(59,130,246,0.1)' }}>
                <div className="text-3xl lg:text-4xl font-extrabold mb-1.5 tracking-tight" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.isYear ? <span>{stat.value}</span> : <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000} />}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {showServices && (
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a, #050816)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_50%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="What We Do" title="Our Core Services" subtitle="End-to-end software solutions engineered for performance and scale." />
            {svcLoading ? <SkeletonGrid count={4} cols={4} /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeServices.slice(0, 6).map((service, i) => {
                  const Icon = iconMap[service.icon] || HiCode
                  const colors = serviceColors[i % serviceColors.length]
                  return (
                    <motion.div key={service.id} className={`group relative p-6 rounded-2xl transition-all duration-500 cursor-default ${colors.border}`}
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5 transition-all duration-500`}>
                          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2.5">{service.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
            <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link to="/services" className="inline-flex items-center gap-2 text-electric-400 font-medium hover:text-electric-300 transition-colors group">
                View All Services <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Products Showcase */}
      {showProducts && activeProducts.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0e1a, #050816)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.04)_0%,transparent_50%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Our Products" title="Built to Solve Real Problems" subtitle="SaaS products and tools designed for modern businesses." />
            {prodLoading ? <SkeletonGrid count={2} cols={2} /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProducts.map((product, i) => (
                  <motion.div key={product.id} className="group p-8 rounded-2xl transition-all duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                    whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(139,92,246,0.1)' }}>
                    {product.image && <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-6" loading="lazy" />}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      {product.status && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{product.status}</span>}
                    </div>
                    {product.tagline && <p className="text-electric-400 font-medium text-sm mb-2">{product.tagline}</p>}
                    <p className="text-gray-400 leading-relaxed mb-4 text-sm">{product.description}</p>
                    {product.tech && <div className="flex flex-wrap gap-1.5 mb-4">{product.tech.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded text-xs text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}</div>}
                    <Link to="/products" className="inline-flex items-center gap-1.5 text-electric-400 font-medium text-sm hover:text-electric-300 group/link">
                      Learn More <HiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Case Studies Preview */}
      {activeCaseStudies.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Case Studies" title="Projects We're Proud Of" />
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
              {activeCaseStudies.map((cs, i) => (
                <motion.div key={cs.id} className="min-w-[280px] snap-start flex-shrink-0 md:min-w-0 p-6 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}>
                  <span className="text-xs text-electric-400 font-medium">{cs.client}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{cs.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{cs.description}</p>
                  {cs.results && <p className="text-xs font-semibold text-emerald-400 mb-3">{cs.results}</p>}
                  <Link to={`/case-studies/${cs.slug || cs.id}`} className="text-xs text-electric-400 font-medium hover:underline">Read More &rarr;</Link>
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link to="/case-studies" className="inline-flex items-center gap-2 text-electric-400 font-medium hover:text-electric-300 group">
                View All Case Studies <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials Carousel */}
      {showTestimonials && activeTestimonials.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0e1a, #050816)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Testimonials" title="What Our Clients Say" />
            <div className="relative" onMouseEnter={pauseCarousel} onMouseLeave={resumeCarousel}>
              <div className="overflow-hidden">
                {activeTestimonials.map((t, i) => (
                  <motion.div key={t.id} className={`${i === currentTest ? 'block' : 'hidden'}`}
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: i === currentTest ? 1 : 0, x: i === currentTest ? 0 : 50 }} transition={{ duration: 0.4 }}>
                    <div className="text-center p-8 sm:p-12 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex justify-center mb-4">
                        {Array.from({ length: 5 }, (_, j) => <HiStar key={j} className={`w-5 h-5 ${j < (t.rating || 5) ? 'text-yellow-400' : 'text-gray-700'}`} />)}
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6 italic max-w-2xl mx-auto">"{t.content}"</p>
                      <div className="flex items-center justify-center gap-3">
                        {t.photo ? <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" /> : <div className="w-12 h-12 rounded-full bg-electric-500/10 flex items-center justify-center text-electric-400 font-bold">{t.name?.[0]}</div>}
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.role}{t.company ? ` at ${t.company}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {activeTestimonials.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {activeTestimonials.map((_, i) => (
                    <button key={i} onClick={() => setCurrentTest(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentTest ? 'bg-electric-400 w-6' : 'bg-white/10 hover:bg-white/20'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {showBlog && activeBlogs.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Blog" title="Latest Insights" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeBlogs.map((post, i) => (
                <motion.article key={post.id} className="rounded-2xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}>
                  {post.image ? <img src={post.image} alt={post.title} className="w-full h-44 object-cover" loading="lazy" /> : <div className="w-full h-44 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0f2e, #0d1033)' }}><span className="text-5xl font-bold text-electric-500/20">H</span></div>}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.author && <><span>&bull;</span><span>{post.author}</span></>}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug || post.id}`} className="text-sm text-electric-400 font-medium hover:text-electric-300">Read More &rarr;</Link>
                  </div>
                </motion.article>
              ))}
            </div>
            <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link to="/blog" className="inline-flex items-center gap-2 text-electric-400 font-medium hover:text-electric-300 group">
                View All Posts <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ background: '#050816' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="relative rounded-2xl sm:rounded-3xl p-8 sm:p-14 lg:p-20 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.04), rgba(6,182,212,0.03))', border: '1px solid rgba(59,130,246,0.1)' }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-40 sm:w-80 h-40 sm:h-80 bg-electric-500/5 rounded-full blur-[80px] sm:blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-60 h-32 sm:h-60 bg-accent-purple/5 rounded-full blur-[60px] sm:blur-[80px]" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-5 tracking-tight">
                Ready to Build Something<span className="gradient-text"> Great?</span>
              </h2>
              <p className="text-gray-400 mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed">Let's discuss how we can bring your ideas to life with technology that scales.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base text-white font-semibold transition-all duration-500 hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}>
                  Get Started <HiArrowRight className="w-4 h-4" />
                </Link>
                <a href={`https://wa.me/${(general?.phone || '919999999999').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-gray-300 hover:text-white transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
