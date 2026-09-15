import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <Helmet><title>404 — Hiideals Technologies</title></Helmet>
      <section className="min-h-[80vh] flex items-center justify-center overflow-hidden section-sky-alt">
        <div className="text-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <h1 className="text-8xl lg:text-[12rem] font-black mb-4 tracking-tight leading-none text-stroke-sky">404</h1>
            <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tight">PAGE NOT FOUND</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold uppercase tracking-wider transition-all bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25">Back to Home</Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
