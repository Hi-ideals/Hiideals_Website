import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <Helmet><title>404 — Hiideals Technologies</title></Helmet>
      <section className="min-h-[80vh] flex items-center justify-center overflow-hidden" style={{ background: '#050816' }}>
        <div className="text-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <h1 className="text-8xl lg:text-9xl font-extrabold mb-4 tracking-tight" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link to="/" className="inline-flex px-8 py-3.5 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.2)' }}>Back to Home</Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
