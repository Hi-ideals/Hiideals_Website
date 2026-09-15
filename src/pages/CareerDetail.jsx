import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiLocationMarker, HiBriefcase, HiCheckCircle } from 'react-icons/hi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { checkRateLimit, sanitizeFormData, isValidEmail, isValidPhone, createBotDetector, enforceLimit } from '../utils/security'

export default function CareerDetail() {
  const { id } = useParams()
  const { data: jobs, loading } = useFirestoreCollection('careers', 'order')
  const job = jobs.find(j => j.id === id)

  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', coverLetter: '' })
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const botDetector = useRef(createBotDetector()).current

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Bot check
    if (botDetector.isBot(honeypot)) { setSubmitted(true); return }

    // Validation
    if (!form.name.trim() || !form.email.trim()) return setError('Name and email are required')
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address')
    if (form.phone && !isValidPhone(form.phone)) return setError('Invalid phone number')

    // Rate limit
    const rl = checkRateLimit('job_application')
    if (!rl.allowed) return setError(rl.message)

    setSubmitting(true); setError('')
    try {
      const sanitized = sanitizeFormData({
        name: enforceLimit(form.name, 'name'),
        email: enforceLimit(form.email.trim().toLowerCase(), 'email'),
        phone: enforceLimit(form.phone, 'phone'),
        experience: enforceLimit(form.experience, 'experience'),
        coverLetter: enforceLimit(form.coverLetter, 'coverLetter'),
      })
      await addDoc(collection(db, 'job_applications'), {
        ...sanitized,
        position: job.title,
        resumeUrl: '',
        status: 'pending',
        read: false,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch { setError('Failed to submit. Please try again.') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen pt-32 px-4 bg-white"><div className="max-w-3xl mx-auto space-y-4"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-8" /><SkeletonBlock className="h-48" /></div></div>

  if (!job) return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2><Link to="/careers" className="text-sky-600 hover:underline">Back to Careers</Link></div>
    </div></PageTransition>
  )

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 focus:outline-none focus:border-sky-400 transition-all"

  return (
    <PageTransition>
      <Helmet><title>{job.title} — Careers — Hiideals Technologies</title></Helmet>

      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <Link to="/" className="hover:text-sky-600">Home</Link><span className="text-gray-300">/</span>
            <Link to="/careers" className="hover:text-sky-600">Careers</Link><span className="text-gray-300">/</span>
            <span className="text-gray-400">{job.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-[0.95]">{job.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1 text-sm text-gray-500"><HiBriefcase className="w-4 h-4" /> {job.type}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><HiLocationMarker className="w-4 h-4" /> {job.location}</span>
            {job.department && <span className="text-sm text-gray-500">{job.department}</span>}
            {job.salary && <span className="text-sm text-sky-600 font-medium">{job.salary}</span>}
          </div>
        </div>
      </section>

      <section className="py-16 section-mesh">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div><h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2><p className="text-gray-500 leading-relaxed">{job.description}</p></div>
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">{job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><HiCheckCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />{r}</li>
                ))}</ul>
              </div>
            )}
          </div>

          {/* Apply Form */}
          <div className="p-6 rounded-2xl h-fit bg-white border border-sky-100 shadow-md">
            {submitted ? (
              <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <HiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Application Submitted!</h3>
                <p className="text-sm text-gray-500">We'll review your application and get back to you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Apply Now</h3>
                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                  <input type="text" name="website_url" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>
                <input type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} className={inputClass} />
                <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={254} className={inputClass} />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={20} className={inputClass} />
                <input type="text" placeholder="Years of Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} maxLength={100} className={inputClass} />
                <textarea placeholder="Cover Letter (optional)" rows={3} value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} maxLength={5000} className={`${inputClass} resize-none`} />
                <p className="text-xs text-gray-400">Email your resume to {job.applyUrl || 'hr@hiideals.com'} after applying.</p>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all bg-sky-500 hover:bg-sky-600">{submitting ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
