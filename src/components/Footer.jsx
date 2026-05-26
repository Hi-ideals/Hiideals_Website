import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import NewsletterSignup from './NewsletterSignup'

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Pricing', path: '/pricing' },
]

const companyLinks = [
  { name: 'Careers', path: '/careers' },
  { name: 'Internships', path: '/internships' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

export default function Footer() {
  const { data: general } = useFirestoreDoc('site_settings', 'general')

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050816, #030610)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: general?.logo ? 'transparent' : 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' }}
              >
                {general?.logo ? (
                  <img src={general.logo} alt={general?.companyName || 'Hiideals'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">H</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none">{general?.companyName || 'Hiideals'}</span>
                <span className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.15em] mt-0.5">Technologies</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xs">
              {general?.tagline || 'Building premium software solutions that drive digital transformation.'}
            </p>

            {/* Newsletter */}
            <NewsletterSignup />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-500 hover:text-electric-400 transition-colors duration-300">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-500 hover:text-electric-400 transition-colors duration-300">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <HiLocationMarker className="w-3.5 h-3.5 text-electric-400" />
                </div>
                <span className="text-sm text-gray-500 leading-relaxed">{general?.address || 'Bidar, Karnataka, India'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <HiMail className="w-3.5 h-3.5 text-electric-400" />
                </div>
                <a href={`mailto:${general?.email || 'info@hiideals.com'}`} className="text-sm text-gray-500 hover:text-electric-400 transition-colors">{general?.email || 'info@hiideals.com'}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <HiPhone className="w-3.5 h-3.5 text-electric-400" />
                </div>
                <a href={`tel:${general?.phone || ''}`} className="text-sm text-gray-500 hover:text-electric-400 transition-colors">{general?.phone || 'Contact us'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Hiideals Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-600">Crafted with</span>
            <motion.span className="text-xs" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>&hearts;</motion.span>
            <span className="text-[10px] text-gray-600">in Bidar</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
