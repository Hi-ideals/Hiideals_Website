import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { SkeletonBlock, SkeletonLine } from '../components/Skeleton'
import { Link001 } from '../components/ui/skiper-ui/skiper40'
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
    <div className="min-h-screen pt-32 px-4 bg-white">
      <div className="max-w-3xl mx-auto space-y-6"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-10" /><SkeletonBlock className="h-64" /><SkeletonLine className="w-full" /><SkeletonLine className="w-4/5" /></div>
    </div>
  )

  if (!post) return (
    <PageTransition>
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2><Link to="/blog" className="text-sky-600 hover:underline">Back to Blog</Link></div>
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
      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.nav className="flex items-center gap-2 text-xs text-gray-500 mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className="hover:text-sky-600">Home</Link><span className="text-gray-300">/</span>
            <Link to="/blog" className="hover:text-sky-600">Blog</Link><span className="text-gray-300">/</span>
            <span className="text-gray-400 truncate">{post.title}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-4">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              {post.author && <><span>&bull;</span><span>{post.author}</span></>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[0.95] mb-5">{post.title}</h1>
            {post.tags && <div className="flex flex-wrap gap-2">{post.tags.map(t => <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 border border-sky-100">{t}</span>)}</div>}
          </motion.div>
        </div>
      </section>

      {post.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <img src={post.image} alt={post.title} className="w-full rounded-2xl border border-gray-200" loading="lazy" />
        </div>
      )}

      {/* Content */}
      <section className="py-16 sm:py-24 section-mesh">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none overflow-hidden [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_p]:text-gray-600 [&_a]:text-sky-600 [&_li]:text-gray-600 [&_blockquote]:border-sky-300 [&_code]:text-sky-700 [&_pre]:bg-gray-50 [&_pre]:border [&_pre]:border-gray-200 [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Share this article</p>
            <div className="flex gap-5">
              <Link001 href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">WhatsApp</Link001>
              <Link001 href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} className="text-sm font-bold text-gray-600 hover:text-sky-600 transition-colors">LinkedIn</Link001>
              <Link001 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`} className="text-sm font-bold text-gray-600 hover:text-sky-500 transition-colors">Twitter</Link001>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link key={r.id} to={`/blog/${r.slug || r.id}`} className="p-4 rounded-xl bg-white border border-sky-100 hover:shadow-md shadow-sm transition-all">
                    <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{r.title}</p>
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
