import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiCheckCircle } from 'react-icons/hi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import { checkRateLimit, sanitizeFormData, isValidEmail, isValidPhone, createBotDetector, enforceLimit } from '../utils/security'

const subjects = ['General Inquiry', 'Project Discussion', 'Partnership', 'Career Related', 'Support', 'Other']

export default function Contact() {
  const { data: settings } = useFirestoreDoc('site_settings', 'general')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const botDetector = useRef(createBotDetector()).current

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Bot detection
    if (botDetector.isBot(honeypot)) {
      setSubmitted(true) // Silently pretend success
      return
    }

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return setError('Name, email, and message are required')
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address')
    if (form.phone && !isValidPhone(form.phone)) return setError('Please enter a valid phone number')
    if (form.message.trim().length < 10) return setError('Message must be at least 10 characters')

    // Rate limit
    const rl = checkRateLimit('contact_form')
    if (!rl.allowed) return setError(rl.message)

    setSubmitting(true); setError('')
    try {
      const sanitized = sanitizeFormData({
        name: enforceLimit(form.name, 'name'),
        email: enforceLimit(form.email.trim().toLowerCase(), 'email'),
        phone: enforceLimit(form.phone, 'phone'),
        subject: enforceLimit(form.subject, 'subject'),
        message: enforceLimit(form.message, 'message'),
      })
      await addDoc(collection(db, 'messages'), { ...sanitized, read: false, createdAt: serverTimestamp() })
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch { setError('Failed to send. Please try again.') }
    setSubmitting(false)
  }

  const contactInfo = [
    { icon: HiLocationMarker, label: 'Visit Us', value: settings?.address || 'Bidar, Karnataka, India' },
    { icon: HiMail, label: 'Email Us', value: settings?.email || 'info@hiideals.com', href: `mailto:${settings?.email || 'info@hiideals.com'}` },
    { icon: HiPhone, label: 'Call Us', value: settings?.phone || 'Contact us', href: `tel:${settings?.phone || ''}` },
    { icon: HiClock, label: 'Working Hours', value: 'Mon - Sat, 9:00 AM - 6:00 PM IST' },
  ]

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:border-electric-500/30"
  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

  return (
    <PageTransition>
      <Helmet>
        <title>Contact — Hiideals Technologies</title>
        <meta name="description" content="Get in touch with Hiideals Technologies. We'd love to hear from you." />
      </Helmet>

      <PageBanner title="Get in Touch" subtitle="Have a project in mind? Let's talk about how we can help your business grow." breadcrumbs={[{ label: 'Contact' }]} />

      {/* Contact Info + Form */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left — Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                <p className="text-sm text-gray-500 mb-6">Fill out the form and our team will get back to you within 24 hours.</p>
              </motion.div>

              {contactInfo.map((item, i) => (
                <motion.div key={i} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <item.icon className="w-4 h-4 text-electric-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    {item.href ? <a href={item.href} className="text-sm text-gray-400 hover:text-electric-400 transition-colors">{item.value}</a> : <p className="text-sm text-gray-400">{item.value}</p>}
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              <motion.div className="pt-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <p className="text-sm text-gray-500 mb-3">Follow us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'LinkedIn', href: settings?.linkedin || '#', color: '#0A66C2' },
                    { label: 'Instagram', href: settings?.instagram || '#', color: '#E4405F' },
                    { label: 'Twitter', href: settings?.twitter || '#', color: '#1DA1F2' },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>{s.label}</a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Form */}
            <motion.div className="lg:col-span-3 p-7 sm:p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <HiCheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-sm text-electric-400 hover:text-electric-300 font-medium">Send Another Message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Send Us a Message</h3>
                  {/* Honeypot — hidden from humans */}
                  <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                    <input type="text" name="website_url" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} className={inputClass} style={inputStyle} />
                    <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={254} className={inputClass} style={inputStyle} />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={20} className={inputClass} style={inputStyle} />
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={inputClass} style={inputStyle}>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Your Message *" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required maxLength={5000} className={`${inputClass} resize-none`} style={inputStyle} />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.2)' }}>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="relative" style={{ background: '#050816' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <iframe
              title="Hiideals Technologies Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60742.66392959038!2d77.4872508!3d17.9133991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcfa9ed5dbf1a6b%3A0x1006840a2e50a80!2sBidar%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%" height="350" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
