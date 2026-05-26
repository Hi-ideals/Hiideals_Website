import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiCheckCircle } from 'react-icons/hi'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { checkRateLimit, isValidEmail, sanitizeInput } from '../utils/security'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'submitting' | 'success' | 'exists' | 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    if (!isValidEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    // Rate limit
    const rl = checkRateLimit('newsletter')
    if (!rl.allowed) {
      setStatus('error')
      setMessage(rl.message)
      return
    }

    setStatus('submitting')
    try {
      const cleanEmail = sanitizeInput(email.trim().toLowerCase())

      // Check if already subscribed
      const snap = await getDocs(query(collection(db, 'newsletter_subscribers'), where('email', '==', cleanEmail)))
      if (!snap.empty) {
        setStatus('exists')
        setMessage('Already subscribed!')
        return
      }

      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: cleanEmail,
        active: true,
        createdAt: serverTimestamp(),
      })

      setStatus('success')
      setMessage('Subscribed successfully!')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Stay Updated</h3>
      <p className="text-sm text-gray-500 mb-4">Get the latest news, updates, and opportunities delivered to your inbox.</p>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-400">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative flex-1">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus(null) }}
                maxLength={254}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-electric-500/30"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white shrink-0 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
            >
              {status === 'submitting' ? '...' : 'Subscribe'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {(status === 'exists' || status === 'error') && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs mt-2 ${status === 'exists' ? 'text-yellow-400' : 'text-red-400'}`}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
