import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiSearch } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { Link000 } from '../components/ui/skiper-ui/skiper40'
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

      <PageBanner title="Our Blog" subtitle="Tech articles, company news, and industry trends from our team." breadcrumbs={[{ label: 'Blog' }]} />

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[120px] translate-y-1/3 translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-4">
            <div className="relative max-w-md mx-auto">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm text-gray-900 placeholder-gray-400 bg-sky-50/50 border border-sky-100 outline-none transition-all focus:border-sky-400 focus:bg-white" />
            </div>
            {allTags.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map(tag => (
                  <button key={tag} onClick={() => setTagFilter(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${tagFilter === tag ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-gray-500 border border-gray-200 hover:text-gray-900 hover:border-sky-200'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? <SkeletonGrid count={6} /> : filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-500">No posts found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.article key={post.id} className="group rounded-2xl overflow-hidden bg-white border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 hover:-translate-y-1 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
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
                    {post.tags && <div className="flex flex-wrap gap-1 mb-3">{post.tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100">{t}</span>)}</div>}
                    <Link000 href={`/blog/${post.slug || post.id}`} className="text-sm font-bold text-sky-600 hover:text-sky-700 uppercase tracking-wider">Read More</Link000>
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
