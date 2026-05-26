import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiLocationMarker, HiBriefcase, HiCheckCircle, HiUpload } from 'react-icons/hi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function CareerDetail() {
  const { id } = useParams()
  const { data: jobs, loading } = useFirestoreCollection('careers', 'order')
  const job = jobs.find(j => j.id === id)

  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', coverLetter: '' })
  const [resumeFile, setResumeFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return setError('Name and email are required')
    setSubmitting(true); setError('')
    try {
      let resumeUrl = ''
      if (resumeFile) {
        if (resumeFile.size > 10 * 1024 * 1024) { setError('Resume must be under 10MB'); setSubmitting(false); return }
        const storageRef = ref(storage, `resumes/${Date.now()}-${resumeFile.name}`)
        await uploadBytes(storageRef, resumeFile)
        resumeUrl = await getDownloadURL(storageRef)
      }
      await addDoc(collection(db, 'job_applications'), { ...form, position: job.title, resumeUrl, status: 'pending', read: false, createdAt: serverTimestamp() })
      setSubmitted(true)
    } catch { setError('Failed to submit. Please try again.') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen pt-32 px-4" style={{ background: '#050816' }}><div className="max-w-3xl mx-auto space-y-4"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-8" /><SkeletonBlock className="h-48" /></div></div>

  if (!job) return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="text-center"><h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2><Link to="/careers" className="text-electric-400 hover:underline">Back to Careers</Link></div>
    </div></PageTransition>
  )

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:border-electric-500/30"
  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

  return (
    <PageTransition>
      <Helmet><title>{job.title} — Careers — Hiideals Technologies</title></Helmet>

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <Link to="/" className="hover:text-electric-400">Home</Link><span className="text-gray-700">/</span>
            <Link to="/careers" className="hover:text-electric-400">Careers</Link><span className="text-gray-700">/</span>
            <span className="text-gray-400">{job.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1 text-sm text-gray-400"><HiBriefcase className="w-4 h-4" /> {job.type}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><HiLocationMarker className="w-4 h-4" /> {job.location}</span>
            {job.department && <span className="text-sm text-gray-400">{job.department}</span>}
            {job.salary && <span className="text-sm text-electric-400 font-medium">{job.salary}</span>}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div><h2 className="text-xl font-bold text-white mb-3">Job Description</h2><p className="text-gray-400 leading-relaxed">{job.description}</p></div>
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Requirements</h2>
                <ul className="space-y-2">{job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><HiCheckCircle className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />{r}</li>
                ))}</ul>
              </div>
            )}
          </div>

          {/* Apply Form */}
          <div className="p-6 rounded-2xl h-fit" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', border: '1px solid rgba(255,255,255,0.05)' }}>
            {submitted ? (
              <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <HiCheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Application Submitted!</h3>
                <p className="text-sm text-gray-500">We'll review your application and get back to you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-2">Apply Now</h3>
                <input type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputClass} style={inputStyle} />
                <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={inputClass} style={inputStyle} />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} style={inputStyle} />
                <input type="text" placeholder="Years of Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className={inputClass} style={inputStyle} />
                <div className="relative">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-500 cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <HiUpload className="w-4 h-4" />{resumeFile ? resumeFile.name : 'Upload Resume (PDF, max 10MB)'}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>
                <textarea placeholder="Cover Letter (optional)" rows={3} value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} className={`${inputClass} resize-none`} style={inputStyle} />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
