import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Careers', path: '/careers' },
  { name: 'Internships', path: '/internships' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { data: general } = useFirestoreDoc('site_settings', 'general')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6 rounded-2xl transition-all duration-500 overflow-hidden ${
          scrolled
            ? 'shadow-xl shadow-sky-300/40'
            : 'shadow-lg shadow-sky-300/30'
        }`}
          style={{ background: 'linear-gradient(135deg, #0080c8 0%, #09a0e7 30%, #22bff8 60%, #09a0e7 80%, #0080c8 100%)' }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }} />

          <Link to="/" className="relative z-10 flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white/30"
              style={{ background: general?.logo ? '#ffffff' : 'linear-gradient(135deg, #ffffff, #e0f2fe)' }}>
              {general?.logo ? (
                <img src={general.logo} alt={general?.companyName || 'Hiideals'} className="w-full h-full object-contain p-0.5" />
              ) : (
                <span className="text-sky-600 font-extrabold text-lg">H</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white leading-none drop-shadow-sm">{general?.companyName || 'Hiideals'}</span>
              <span className="text-[9px] font-semibold text-sky-100 uppercase tracking-[0.15em] leading-none mt-0.5">Technologies</span>
            </div>
          </Link>

          <div className="relative z-10 hidden lg:flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-xl px-1 py-0.5 border border-white/15">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path} className="relative px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors">
                  {isActive && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-sky-600' : 'text-white hover:text-sky-100'}`}>{link.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link to="/contact"
              className="hidden sm:inline-flex px-5 py-2 rounded-xl text-sm font-bold text-sky-700 bg-white hover:bg-sky-50 transition-colors shadow-md hover:shadow-lg">
              Get in Touch
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl text-white hover:text-white hover:bg-white/15 transition-colors" aria-label="Toggle menu">
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="lg:hidden mx-4 mt-2">
            <div className="px-4 py-3 space-y-1 rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-100 shadow-xl shadow-sky-200/30">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'text-sky-600 bg-sky-50 font-semibold' : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50/50'
                  }`}>{link.name}</Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-white text-sm font-semibold text-center mt-2 bg-gradient-to-r from-sky-500 to-sky-600 shadow-sm">Get in Touch</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
