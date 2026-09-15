import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiCheckCircle, HiArrowRight } from 'react-icons/hi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import { Link001 } from '../components/ui/skiper-ui/skiper40'
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

    if (botDetector.isBot(honeypot)) {
      setSubmitted(true)
      return
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return setError('Name, email, and message are required')
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address')
    if (form.phone && !isValidPhone(form.phone)) return setError('Please enter a valid phone number')
    if (form.message.trim().length < 10) return setError('Message must be at least 10 characters')

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

  const inputClass = "w-full px-5 py-4 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-sky-50/50 border border-sky-100 focus:outline-none focus:border-sky-400 focus:bg-white transition-all"

  return (
    <PageTransition>
      <Helmet>
        <title>Contact — Hiideals Technologies</title>
        <meta name="description" content="Get in touch with Hiideals Technologies. We'd love to hear from you." />
      </Helmet>

      <PageBanner title="Get in Touch" subtitle="Have a project in mind? Let's talk about how we can help your business grow." breadcrumbs={[{ label: 'Contact' }]} />

      <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-50 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500 mb-3 block">Reach Out</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-[0.95] mb-2">CONTACT <span className="text-stroke-sky">INFO.</span></h2>
                <p className="text-sm text-gray-500 mb-6">Fill out the form and our team will get back to you within 24 hours.</p>
              </motion.div>

              {contactInfo.map((item, i) => (
                <motion.div key={i} className="group flex items-start gap-4 p-5 rounded-2xl bg-sky-50/50 border border-sky-100/80 hover:bg-white hover:shadow-xl hover:shadow-sky-100/50 hover:border-sky-200 transition-all duration-500"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-sky-100 group-hover:bg-sky-500 transition-colors duration-300">
                    <item.icon className="w-4.5 h-4.5 text-sky-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    {item.href ? <a href={item.href} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">{item.value}</a> : <p className="text-sm text-gray-500">{item.value}</p>}
                  </div>
                </motion.div>
              ))}

              <motion.div className="pt-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Follow us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'LinkedIn', href: settings?.linkedin || '#' },
                    { label: 'Instagram', href: settings?.instagram || '#' },
                    { label: 'Twitter', href: settings?.twitter || '#' },
                  ].map(s => (
                    <Link001 key={s.label} href={s.href} className="text-sm font-bold text-gray-500 hover:text-sky-600 transition-colors">{s.label}</Link001>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className="lg:col-span-3 p-7 sm:p-9 rounded-2xl bg-white border border-sky-100 shadow-xl shadow-sky-100/30"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <HiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">MESSAGE SENT!</h3>
                  <p className="text-sm text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-sm text-sky-600 hover:text-sky-700 font-bold uppercase tracking-wider">Send Another Message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-5">SEND A <span className="text-stroke-sky">MESSAGE.</span></h3>
                  <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                    <input type="text" name="website_url" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} className={inputClass} />
                    <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={254} className={inputClass} />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={20} className={inputClass} />
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={inputClass}>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea placeholder="Your Message *" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required maxLength={5000} className={`${inputClass} resize-none`} />
                  {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-white font-bold text-sm uppercase tracking-wider disabled:opacity-50 transition-all bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                    {submitting ? 'Sending...' : 'Send Message'} <HiArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative bg-white pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="rounded-2xl overflow-hidden border border-sky-100 shadow-lg"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <iframe
              title="Hiideals Technologies Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1316.6970097393983!2d77.51459011897028!3d17.904978587614227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcec6dfefdc6995%3A0xff6da47ae7c68473!2sHi-Ideals%20Technologies%20Private%20Limited.!5e0!3m2!1sen!2sin!4v1784806007921!5m2!1sen!2sin"
              width="100%" height="350" style={{ border: 0 }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
