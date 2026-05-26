import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { SkeletonBlock, SkeletonLine } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function BlogPost() {
  const { slug } = useParams()
  const { data: posts, loading } = useFirestoreCollection('blog_posts', 'createdAt')
  const post = posts.find(p => p.slug === slug || p.id === slug)

  const formatDate = (d) => {
    if (!d) return ''
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) return (
    <div className="min-h-screen pt-32 px-4" style={{ background: '#050816' }}>
      <div className="max-w-3xl mx-auto space-y-6"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-10" /><SkeletonBlock className="h-64" /><SkeletonLine className="w-full" /><SkeletonLine className="w-4/5" /></div>
    </div>
  )

  if (!post) return (
    <PageTransition>
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
        <div className="text-center"><h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2><Link to="/blog" className="text-electric-400 hover:underline">Back to Blog</Link></div>
      </div>
    </PageTransition>
  )

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const related = posts.filter(p => p.id !== post.id && p.published !== false && p.active !== false).slice(0, 3)

  return (
    <PageTransition>
      <Helmet>
        <title>{post.title} — Hiideals Technologies</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.nav className="flex items-center gap-2 text-xs text-gray-500 mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className="hover:text-electric-400">Home</Link><span className="text-gray-700">/</span>
            <Link to="/blog" className="hover:text-electric-400">Blog</Link><span className="text-gray-700">/</span>
            <span className="text-gray-400 truncate">{post.title}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              {post.author && <><span>&bull;</span><span>{post.author}</span></>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">{post.title}</h1>
            {post.tags && <div className="flex flex-wrap gap-2">{post.tags.map(t => <span key={t} className="px-3 py-1 rounded-lg text-xs font-medium text-gray-300" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>)}</div>}
          </motion.div>
        </div>
      </section>

      {post.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <img src={post.image} alt={post.title} className="w-full rounded-2xl border border-white/[0.06]" loading="lazy" />
        </div>
      )}

      {/* Content */}
      <section className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-invert prose-lg max-w-none [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-gray-300 [&_a]:text-electric-400 [&_li]:text-gray-300 [&_blockquote]:border-electric-500/30 [&_code]:text-electric-300 [&_pre]:bg-white/[0.03] [&_pre]:border [&_pre]:border-white/[0.06]"
            dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <p className="text-sm text-gray-500 mb-3">Share this article</p>
            <div className="flex gap-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors" style={{ background: '#25D366' }}>WhatsApp</a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors" style={{ background: '#0A66C2' }}>LinkedIn</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors" style={{ background: '#1DA1F2' }}>Twitter</a>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-white mb-6">Related Posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link key={r.id} to={`/blog/${r.slug || r.id}`} className="p-4 rounded-xl transition-all hover:bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-sm font-semibold text-white mb-1 line-clamp-2">{r.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(r.publishedAt || r.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
