import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiInformationCircle, HiCheckCircle, HiExclamation, HiLightningBolt } from 'react-icons/hi'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const typeConfig = {
  info: {
    bg: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(59,130,246,0.08))',
    border: 'rgba(59,130,246,0.2)',
    text: '#60a5fa',
    icon: HiInformationCircle,
  },
  success: {
    bg: 'linear-gradient(90deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
    border: 'rgba(16,185,129,0.2)',
    text: '#34d399',
    icon: HiCheckCircle,
  },
  warning: {
    bg: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))',
    border: 'rgba(245,158,11,0.2)',
    text: '#fbbf24',
    icon: HiExclamation,
  },
  urgent: {
    bg: 'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))',
    border: 'rgba(239,68,68,0.2)',
    text: '#f87171',
    icon: HiLightningBolt,
  },
  alert: {
    bg: 'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))',
    border: 'rgba(239,68,68,0.2)',
    text: '#f87171',
    icon: HiLightningBolt,
  },
}

export default function AnnouncementBar({ onVisibilityChange }) {
  const [notification, setNotification] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const snap = await getDocs(collection(db, 'notifications'))
        const now = new Date()
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => {
            if (n.active === false) return false
            // Check expiry
            if (n.expiry_date) {
              const expiry = n.expiry_date.seconds ? new Date(n.expiry_date.seconds * 1000) : new Date(n.expiry_date)
              if (expiry < now) return false
            }
            return true
          })
          .sort((a, b) => {
            const aT = a.createdAt?.seconds || 0
            const bT = b.createdAt?.seconds || 0
            return bT - aT
          })[0]

        if (active) {
          const dismissKey = `hiideals_dismissed_notification_${active.id}`
          if (!localStorage.getItem(dismissKey)) {
            setNotification(active)
            onVisibilityChange?.(true)
          }
        }
      } catch {}
    }
    fetchNotification()
  }, [])

  const handleDismiss = () => {
    if (notification) {
      localStorage.setItem(`hiideals_dismissed_notification_${notification.id}`, 'true')
    }
    setDismissed(true)
    onVisibilityChange?.(false)
  }

  const config = typeConfig[notification?.type] || typeConfig.info
  const Icon = config.icon

  return (
    <AnimatePresence>
      {notification && !dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden relative z-[60]"
        >
          <div
            className={`flex items-center justify-center gap-3 px-4 py-2.5 text-center relative ${notification.type === 'urgent' ? 'animate-pulse' : ''}`}
            style={{
              background: config.bg,
              borderBottom: `1px solid ${config.border}`,
            }}
          >
            <Icon className="w-4 h-4 shrink-0 hidden sm:block" style={{ color: config.text }} />
            <p className="text-xs sm:text-sm font-medium" style={{ color: config.text }}>
              {notification.title}{notification.message ? ` — ${notification.message}` : ''}
            </p>
            {notification.url && (
              <Link
                to={notification.url}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:brightness-110 shrink-0"
                style={{ background: `${config.text}20`, color: config.text, border: `1px solid ${config.text}30` }}
              >
                {notification.cta || 'Learn More'}
              </Link>
            )}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <HiX className="w-3.5 h-3.5" style={{ color: config.text }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
