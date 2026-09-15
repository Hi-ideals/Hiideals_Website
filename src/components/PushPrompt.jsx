import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBell, HiX } from 'react-icons/hi'
import { getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, getMessagingInstance } from '../firebase/config'
import { useToast } from '../context/ToastContext'
import { checkRateLimit } from '../utils/security'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || ''

export default function PushPrompt() {
  const [show, setShow] = useState(false)
  const toast = useToast()

  useEffect(() => {
    // Don't show if already decided or not supported
    const decision = localStorage.getItem('hiideals_push_decision')
    if (decision) return
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return

    const timer = setTimeout(() => setShow(true), 15000)
    return () => clearTimeout(timer)
  }, [])

  // Listen for foreground messages
  useEffect(() => {
    let unsubscribe = null
    const setupForeground = async () => {
      try {
        const messaging = await getMessagingInstance()
        if (!messaging) return
        unsubscribe = onMessage(messaging, (payload) => {
          const title = payload.notification?.title || 'Hiideals Technologies'
          const body = payload.notification?.body || ''
          toast.info(`${title}${body ? ': ' + body : ''}`)
        })
      } catch {}
    }
    setupForeground()
    return () => { if (unsubscribe) unsubscribe() }
  }, [toast])

  const handleAllow = async () => {
    setShow(false)
    localStorage.setItem('hiideals_push_decision', 'allowed')

    const rl = checkRateLimit('fcm_token')
    if (!rl.allowed) return

    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const messaging = await getMessagingInstance()
        if (!messaging) return
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
        })
        if (token) {
          // Save token to Firestore
          await setDoc(doc(db, 'fcm_tokens', token), {
            token,
            browser: navigator.userAgent.slice(0, 100),
            createdAt: serverTimestamp(),
            active: true,
          })
        }
      }
    } catch (err) {
      console.warn('Push notification setup failed:', err.message)
    }
  }

  const handleLater = () => {
    setShow(false)
    localStorage.setItem('hiideals_push_decision', 'later')
    // Allow prompt again after 7 days
    localStorage.setItem('hiideals_push_later_date', new Date().toISOString())
  }

  // Check if "later" has expired (7 days)
  useEffect(() => {
    const laterDate = localStorage.getItem('hiideals_push_later_date')
    if (laterDate && localStorage.getItem('hiideals_push_decision') === 'later') {
      const diff = Date.now() - new Date(laterDate).getTime()
      if (diff > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('hiideals_push_decision')
        localStorage.removeItem('hiideals_push_later_date')
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-80 rounded-2xl p-4 bg-white border border-gray-200 shadow-xl"
        >
          <button
            onClick={handleLater}
            className="absolute top-2.5 right-2.5 p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <HiX className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sky-50 border border-sky-100">
              <HiBell className="w-5 h-5 text-sky-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1">Stay Updated</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Get notified about new products, internships, and opportunities.</p>
              <div className="flex items-center gap-2">
                <button onClick={handleAllow} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors">Allow</button>
                <button onClick={handleLater} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 bg-gray-50 transition-colors">Maybe Later</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
