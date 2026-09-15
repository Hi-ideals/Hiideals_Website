import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiEye, HiArrowRight } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import ProductModal from '../components/ProductModal'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const statusColor = (s) => {
  if (s === 'Live') return 'bg-emerald-50 text-emerald-600 border-emerald-200'
  if (s === 'Beta') return 'bg-amber-50 text-amber-600 border-amber-200'
  if (s === 'In Development') return 'bg-sky-50 text-sky-600 border-sky-200'
  return 'bg-gray-50 text-gray-500 border-gray-200'
}

export default function Products() {
  const { data: products, loading } = useFirestoreCollection('products', 'order')
  const activeProducts = products.filter(p => p.active !== false)
  const [filter, setFilter] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const categories = ['All', ...new Set(activeProducts.map(p => p.category).filter(Boolean))]
  const filtered = filter === 'All' ? activeProducts : activeProducts.filter(p => p.category === filter)

  return (
    <PageTransition>
      <Helmet><title>Products — Hiideals Technologies</title><meta name="description" content="SaaS products and tools built to solve real business problems." /></Helmet>
      <PageBanner title="Our Products" subtitle="SaaS products and tools built to solve real business problems." breadcrumbs={[{ label: 'Products' }]} />

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${filter === cat ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-gray-500 border border-gray-200 hover:text-gray-900 hover:border-sky-200'}`}>{cat}</button>
              ))}
            </div>
          )}
          {loading ? <SkeletonGrid count={4} cols={2} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, i) => (
                <motion.div key={product.id} className="group rounded-2xl overflow-hidden bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  {product.image && (
                    <div className="relative h-52 overflow-hidden bg-sky-50">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      {product.status && <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor(product.status)}`}>{product.status}</span>}
                    </div>
                    {product.tagline && <p className="text-sky-600 font-medium text-sm mb-2">{product.tagline}</p>}
                    {product.category && <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-3 inline-block">{product.category}</span>}
                    <p className="text-gray-500 leading-relaxed mb-4 text-sm line-clamp-3">{product.description}</p>
                    {product.tech && <div className="flex flex-wrap gap-1.5 mb-5">{product.tech.map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">{t}</span>)}</div>}
                    <button onClick={() => setSelectedProduct(product)} className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-sky-600 transition-colors group/btn">
                      <HiEye className="w-4 h-4" /> View Details <HiArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </PageTransition>
  )
}
