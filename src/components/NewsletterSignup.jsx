import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiCheckCircle } from 'react-icons/hi'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
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

      // Check if already subscribed (email IS the document ID — no list query needed)
      const existingDoc = await getDoc(doc(db, 'newsletter_subscribers', cleanEmail))
      if (existingDoc.exists()) {
        setStatus('exists')
        setMessage('Already subscribed!')
        return
      }

      // Use email as doc ID — prevents duplicates at the database level
      await setDoc(doc(db, 'newsletter_subscribers', cleanEmail), {
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
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Stay Updated</h3>
      <p className="text-sm text-gray-400 mb-4">Get the latest news, updates, and opportunities delivered to your inbox.</p>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-xl"
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <HiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-600">{message}</p>
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
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Your email" value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus(null) }}
                maxLength={254}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors border border-gray-200 bg-white focus:border-sky-400" />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white shrink-0 bg-sky-500 hover:bg-sky-600 transition-colors disabled:opacity-50"
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
          className={`text-xs mt-2 ${status === 'exists' ? 'text-amber-600' : 'text-red-500'}`}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
