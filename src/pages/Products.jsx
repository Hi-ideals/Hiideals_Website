import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiExternalLink, HiArrowRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const statusColor = (s) => {
  if (s === 'Live') return { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.15)' }
  if (s === 'Beta') return { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.15)' }
  if (s === 'In Development') return { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.15)' }
  return { bg: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: 'rgba(255,255,255,0.08)' }
}

export default function Products() {
  const { data: products, loading } = useFirestoreCollection('products', 'order')
  const activeProducts = products.filter(p => p.active !== false)
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(activeProducts.map(p => p.category).filter(Boolean))]
  const filtered = filter === 'All' ? activeProducts : activeProducts.filter(p => p.category === filter)

  return (
    <PageTransition>
      <Helmet><title>Products — Hiideals Technologies</title><meta name="description" content="SaaS products and tools built to solve real business problems." /></Helmet>

      <PageBanner title="Our Products" subtitle="SaaS products and tools built to solve real business problems." breadcrumbs={[{ label: 'Products' }]} />

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === cat ? 'bg-electric-500/10 text-electric-400 border border-electric-500/20' : 'text-gray-500 hover:text-white border border-white/[0.06] hover:border-white/10'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? <SkeletonGrid count={4} cols={2} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((product, i) => {
                const sc = statusColor(product.status)
                return (
                  <motion.div key={product.id} className="group p-8 rounded-2xl transition-all duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(139,92,246,0.1)' }}>
                    {product.image && <img src={product.image} alt={product.name} className="w-full h-52 object-cover rounded-xl mb-6" loading="lazy" />}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      {product.status && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{product.status}</span>}
                    </div>
                    {product.tagline && <p className="text-electric-400 font-medium text-sm mb-2">{product.tagline}</p>}
                    {product.category && <span className="text-xs text-gray-500 mb-3 inline-block">{product.category}</span>}
                    <p className="text-gray-400 leading-relaxed mb-4 text-sm">{product.description}</p>
                    {product.tech && <div className="flex flex-wrap gap-1.5 mb-5">{product.tech.map(t => <span key={t} className="px-2 py-0.5 rounded text-xs text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}</div>}
                    {product.url && <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-electric-400 font-medium text-sm hover:text-electric-300">Live Demo <HiExternalLink className="w-4 h-4" /></a>}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
