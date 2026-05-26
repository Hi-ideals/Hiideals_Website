import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiLocationMarker, HiClock, HiCheckCircle, HiUpload } from 'react-icons/hi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import PageTransition from '../components/PageTransition'
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

export default function InternshipDetail() {
  const { id } = useParams()
  const { data: internships, loading } = useFirestoreCollection('internships', 'order')
  const intern = internships.find(i => i.id === id)

  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', branch: '', year: '', skills: '', coverLetter: '' })
  const [resumeFile, setResumeFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.college) return setError('Name, email, and college are required')
    setSubmitting(true); setError('')
    try {
      let resumeUrl = ''
      if (resumeFile) {
        if (resumeFile.size > 10 * 1024 * 1024) { setError('Resume must be under 10MB'); setSubmitting(false); return }
        const storageRef = ref(storage, `resumes/${Date.now()}-${resumeFile.name}`)
        await uploadBytes(storageRef, resumeFile)
        resumeUrl = await getDownloadURL(storageRef)
      }
      await addDoc(collection(db, 'internship_applications'), { ...form, position: intern.title, resumeUrl, status: 'pending', read: false, createdAt: serverTimestamp() })
      setSubmitted(true)
    } catch { setError('Failed to submit. Please try again.') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen pt-32 px-4" style={{ background: '#050816' }}><div className="max-w-3xl mx-auto space-y-4"><SkeletonLine className="w-1/3 h-4" /><SkeletonLine className="w-2/3 h-8" /><SkeletonBlock className="h-48" /></div></div>

  if (!intern) return (
    <PageTransition><div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#050816' }}>
      <div className="text-center"><h2 className="text-2xl font-bold text-white mb-2">Internship Not Found</h2><Link to="/internships" className="text-electric-400 hover:underline">Back to Internships</Link></div>
    </div></PageTransition>
  )

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all focus:border-electric-500/30"
  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

  return (
    <PageTransition>
      <Helmet><title>{intern.title} — Internships — Hiideals Technologies</title></Helmet>

      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <Link to="/" className="hover:text-electric-400">Home</Link><span className="text-gray-700">/</span>
            <Link to="/internships" className="hover:text-electric-400">Internships</Link><span className="text-gray-700">/</span>
            <span className="text-gray-400">{intern.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">{intern.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1 text-sm text-gray-400"><HiClock className="w-4 h-4" /> {intern.duration}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><HiLocationMarker className="w-4 h-4" /> {intern.location}</span>
            {intern.stipend && <span className="text-sm text-emerald-400 font-medium">{intern.stipend}</span>}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {intern.description && <div><h2 className="text-xl font-bold text-white mb-3">About This Internship</h2><p className="text-gray-400 leading-relaxed">{intern.description}</p></div>}
            {intern.requirements && intern.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Requirements</h2>
                <ul className="space-y-2">{intern.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><HiCheckCircle className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />{r}</li>
                ))}</ul>
              </div>
            )}
            {intern.learnings && intern.learnings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">What You'll Learn</h2>
                <ul className="space-y-2">{intern.learnings.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{l}</li>
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
                <input type="text" placeholder="College / University *" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} required className={inputClass} style={inputStyle} />
                <input type="text" placeholder="Branch / Department" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className={inputClass} style={inputStyle} />
                <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputClass} style={inputStyle}>
                  <option value="">Year of Study</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated</option>
                </select>
                <input type="text" placeholder="Skills (e.g. React, Python, Figma)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className={inputClass} style={inputStyle} />
                <div className="relative">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-500 cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <HiUpload className="w-4 h-4" />{resumeFile ? resumeFile.name : 'Upload Resume (PDF, max 10MB)'}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>
                <textarea placeholder="Why do you want this internship? (optional)" rows={3} value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} className={`${inputClass} resize-none`} style={inputStyle} />
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
