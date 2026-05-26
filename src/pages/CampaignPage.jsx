import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiClock, HiExclamationCircle, HiUpload } from 'react-icons/hi'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import { SkeletonBlock, SkeletonLine } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function CampaignPage() {
  const { id } = useParams()
  const { data: campaigns, loading } = useFirestoreCollection('campaigns')
  const campaign = campaigns.find(c => c.id === id)

  const [form, setForm] = useState({})
  const [files, setFiles] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [duplicate, setDuplicate] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const now = new Date()

  const getStatus = () => {
    if (!campaign) return 'not_found'
    if (campaign.active === false) return 'inactive'
    if (campaign.start_date) {
      const start = campaign.start_date.seconds ? new Date(campaign.start_date.seconds * 1000) : new Date(campaign.start_date)
      if (start > now) return 'upcoming'
    }
    if (campaign.end_date) {
      const end = campaign.end_date.seconds ? new Date(campaign.end_date.seconds * 1000) : new Date(campaign.end_date)
      if (end < now) return 'expired'
    }
    return 'active'
  }

  const status = loading ? 'loading' : getStatus()
  const fields = campaign?.fields || []

  const validateField = (field, value) => {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) return `${field.label || field.name} is required`
    if (field.type === 'email' && value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(value)) return 'Invalid email format'
    }
    if (field.type === 'phone' && value) {
      const phoneRe = /^[+]?[\d\s()-]{7,15}$/
      if (!phoneRe.test(value)) return 'Invalid phone number'
    }
    return ''
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field.name]: value }))
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field.name]: error }))
  }

  const handleFileChange = (field, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field.name]: 'File must be under 5MB' }))
      return
    }
    setFiles(prev => ({ ...prev, [field.name]: file }))
    setErrors(prev => ({ ...prev, [field.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate all
    const newErrors = {}
    let hasError = false
    fields.forEach(f => {
      const val = f.type === 'file' ? files[f.name] : form[f.name]
      const err = validateField(f, val)
      if (err) { newErrors[f.name] = err; hasError = true }
    })
    setErrors(newErrors)
    if (hasError) return

    setSubmitting(true)

    try {
      // Check duplicate by email
      const emailField = fields.find(f => f.type === 'email')
      if (emailField && form[emailField.name]) {
        const dupeSnap = await getDocs(
          query(collection(db, 'form_submissions'), where('campaign_id', '==', id), where(`responses.${emailField.name}`, '==', form[emailField.name]))
        )
        if (!dupeSnap.empty) {
          setDuplicate(true)
          setSubmitting(false)
          return
        }
      }

      // Upload files
      const responses = { ...form }
      for (const [name, file] of Object.entries(files)) {
        if (file) {
          const storageRef = ref(storage, `campaign_files/${id}/${Date.now()}-${file.name}`)
          await uploadBytes(storageRef, file)
          responses[name] = await getDownloadURL(storageRef)
        }
      }

      await addDoc(collection(db, 'form_submissions'), {
        campaign_id: id,
        campaign_name: campaign.title,
        responses,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch {
      setErrors(prev => ({ ...prev, _form: 'Failed to submit. Please try again.' }))
    }
    setSubmitting(false)
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:border-electric-500/30"
  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

  const renderField = (field, i) => {
    const key = field.name || `field_${i}`

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={key}>
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              placeholder={`${field.label || field.name}${field.required ? ' *' : ''}`}
              value={form[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div key={key}>
            <textarea
              placeholder={`${field.label || field.name}${field.required ? ' *' : ''}`}
              rows={4}
              value={form[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={key}>
            <select
              value={form[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              <option value="">{`Select ${field.label || field.name}${field.required ? ' *' : ''}`}</option>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={key}>
            <p className="text-sm text-gray-400 mb-2">{field.label}{field.required ? ' *' : ''}</p>
            <div className="flex flex-wrap gap-3">
              {(field.options || []).map(opt => {
                const selected = (form[field.name] || []).includes(opt)
                return (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        const current = form[field.name] || []
                        const updated = selected ? current.filter(v => v !== opt) : [...current, opt]
                        handleChange(field, updated)
                      }}
                      className="w-4 h-4 rounded accent-electric-500"
                    />
                    <span className="text-sm text-gray-300">{opt}</span>
                  </label>
                )
              })}
            </div>
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )

      case 'file':
        return (
          <div key={key}>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-500 cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <HiUpload className="w-4 h-4" />
              {files[field.name] ? files[field.name].name : `${field.label || 'Upload File'}${field.required ? ' *' : ''} (max 5MB)`}
              <input type="file" onChange={(e) => handleFileChange(field, e.target.files?.[0])} className="hidden" />
            </label>
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )

      default:
        return (
          <div key={key}>
            <input
              type="text"
              placeholder={`${field.label || field.name}${field.required ? ' *' : ''}`}
              value={form[field.name] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
          </div>
        )
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen pt-32 px-4" style={{ background: '#050816' }}>
      <div className="max-w-2xl mx-auto space-y-4"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-8" /><SkeletonBlock className="h-64" /></div>
    </div>
  )

  if (status === 'not_found' || status === 'inactive') return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="text-center">
        <HiExclamationCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Not Found</h2>
        <p className="text-gray-500 mb-4">This campaign doesn't exist or is no longer active.</p>
        <Link to="/" className="text-electric-400 hover:underline text-sm">Back to Home</Link>
      </div>
    </div></PageTransition>
  )

  if (status === 'upcoming') return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="text-center">
        <HiClock className="w-12 h-12 text-electric-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-500 mb-2">{campaign.title}</p>
        <p className="text-sm text-gray-600">This campaign hasn't started yet. Check back soon!</p>
      </div>
    </div></PageTransition>
  )

  if (status === 'expired') return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="text-center">
        <HiExclamationCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Expired</h2>
        <p className="text-gray-500 mb-2">{campaign.title}</p>
        <p className="text-sm text-gray-600 mb-4">This campaign has ended.</p>
        <Link to="/" className="text-electric-400 hover:underline text-sm">Back to Home</Link>
      </div>
    </div></PageTransition>
  )

  return (
    <PageTransition>
      <Helmet><title>{campaign.title} — Hiideals Technologies</title></Helmet>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899'][i % 7],
                left: `${Math.random() * 100}%`,
                top: -10,
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                opacity: 0,
                rotate: Math.random() * 720 - 360,
                x: Math.random() * 200 - 100,
              }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <Link to="/" className="hover:text-electric-400">Home</Link><span className="text-gray-700">/</span>
            <span className="text-gray-400">{campaign.title}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">{campaign.title}</h1>
            {campaign.description && <p className="text-gray-400 mb-8 leading-relaxed">{campaign.description}</p>}
          </motion.div>

          {/* Form */}
          <motion.div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <HiCheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Submitted Successfully! 🎉</h3>
                <p className="text-sm text-gray-500">Thank you for your submission. We'll be in touch soon.</p>
              </motion.div>
            ) : duplicate ? (
              <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <HiExclamationCircle className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Already Submitted</h3>
                <p className="text-sm text-gray-500">You have already submitted this form. Thank you!</p>
              </motion.div>
            ) : fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">This campaign has no form fields configured.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field, i) => renderField(field, i))}
                {errors._form && <p className="text-xs text-red-400">{errors._form}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 25px rgba(59,130,246,0.2)' }}
                >
                  {submitting ? 'Submitting...' : campaign.cta || 'Submit'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
