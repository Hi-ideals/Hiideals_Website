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
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Pricing', path: '/pricing' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'py-2'
          : 'py-3'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
        scrolled ? '' : ''
      }`}>
        <div className={`flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6 rounded-2xl transition-all duration-700 ${
          scrolled
            ? 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-electric-500/20 group-hover:shadow-electric-500/40 transition-all duration-300 overflow-hidden"
                style={{
                  background: general?.logo ? 'transparent' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                }}
              >
                {general?.logo ? (
                  <img src={general.logo} alt={general?.companyName || 'Hiideals'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg relative z-10">H</span>
                )}
              </div>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-lg"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">{general?.companyName || 'Hiideals'}</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.15em] leading-none mt-0.5">Technologies</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] rounded-xl px-1.5 py-1 border border-white/[0.04]">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-1.5 text-[13px] font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
                        boxShadow: '0 0 20px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                        border: '1px solid rgba(59,130,246,0.15)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-electric-400' : 'text-gray-400 hover:text-white'}`}>
                    {link.name}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden sm:inline-flex px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                boxShadow: '0 4px 15px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Get in Touch
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mx-4 mt-2"
          >
            <div className="px-4 py-3 space-y-1 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-electric-400 bg-electric-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-white text-sm font-semibold text-center mt-2"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
