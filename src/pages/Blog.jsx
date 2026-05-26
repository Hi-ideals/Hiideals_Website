import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiSearch } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function Blog() {
  const { data: posts, loading } = useFirestoreCollection('blog_posts', 'createdAt')
  const published = posts.filter(p => p.published !== false && p.active !== false)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('All')

  const allTags = useMemo(() => {
    const tags = new Set()
    published.forEach(p => (p.tags || []).forEach(t => tags.add(t)))
    return ['All', ...tags]
  }, [published])

  const filtered = useMemo(() => {
    let list = published
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q))
    }
    if (tagFilter !== 'All') list = list.filter(p => (p.tags || []).includes(tagFilter))
    return list
  }, [published, search, tagFilter])

  const formatDate = (d) => {
    if (!d) return ''
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <PageTransition>
      <Helmet><title>Blog — Hiideals Technologies</title><meta name="description" content="Tech articles, company news, and industry trends from our team." /></Helmet>

      <PageBanner title="Blog" subtitle="Tech articles, company news, and industry trends from our team." breadcrumbs={[{ label: 'Blog' }]} />

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Tags */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-electric-500/30"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>
            {allTags.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map(tag => (
                  <button key={tag} onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tagFilter === tag ? 'bg-electric-500/10 text-electric-400 border border-electric-500/20' : 'text-gray-500 border border-white/[0.06] hover:text-white'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? <SkeletonGrid count={6} /> : filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500">No posts found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => (
                <motion.article key={post.id} className="group rounded-2xl overflow-hidden transition-all duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}>
                  {post.image ? <img src={post.image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" /> : <div className="w-full h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0f2e, #0d1033)' }}><span className="text-5xl font-bold text-electric-500/20">H</span></div>}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.author && <><span>&bull;</span><span>{post.author}</span></>}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-electric-400 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    {post.tags && <div className="flex flex-wrap gap-1 mb-3">{post.tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px] text-gray-400" style={{ background: 'rgba(255,255,255,0.04)' }}>{t}</span>)}</div>}
                    <Link to={`/blog/${post.slug || post.id}`} className="text-sm text-electric-400 font-medium hover:text-electric-300">Read More &rarr;</Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
