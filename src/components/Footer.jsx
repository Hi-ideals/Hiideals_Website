import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import NewsletterSignup from './NewsletterSignup'
import { Link000, Link001 } from './ui/skiper-ui/skiper40'

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
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
    <footer className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: general?.logo ? '#ffffff' : 'linear-gradient(135deg, #09a0e7, #22bff8)' }}>
                {general?.logo ? (
                  <img src={general.logo} alt={general?.companyName || 'Hiideals'} className="w-full h-full object-contain p-0.5" />
                ) : (
                  <span className="text-white font-bold text-lg">H</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-none">{general?.companyName || 'Hiideals'}</span>
                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.15em] mt-0.5">Technologies</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xs">
              {general?.tagline || 'Building premium software solutions that drive digital transformation.'}
            </p>
            <NewsletterSignup />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link000 href={link.path} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">{link.name}</Link000>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.path}>
                  <Link000 href={link.path} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">{link.name}</Link000>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-sky-50 border border-sky-100">
                  <HiLocationMarker className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <span className="text-sm text-gray-500 leading-relaxed">{general?.address || 'Bidar, Karnataka, India'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-sky-50 border border-sky-100">
                  <HiMail className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <Link001 href={`mailto:${general?.email || 'info@hiideals.com'}`} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">{general?.email || 'info@hiideals.com'}</Link001>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-sky-50 border border-sky-100">
                  <HiPhone className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <Link001 href={`tel:${general?.phone || ''}`} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">{general?.phone || 'Contact us'}</Link001>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sky-100">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Hiideals Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">Crafted with</span>
            <motion.span className="text-xs text-red-400" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>&hearts;</motion.span>
            <span className="text-[10px] text-gray-400">in Bidar</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
