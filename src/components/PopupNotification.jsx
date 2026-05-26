import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiSpeakerphone, HiAcademicCap, HiBell } from 'react-icons/hi'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function PopupNotification() {
  const [popup, setPopup] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if already shown today
    const today = new Date().toISOString().slice(0, 10)
    const shownKey = `hiideals_popup_shown_${today}`
    if (localStorage.getItem(shownKey)) return

    const timer = setTimeout(async () => {
      try {
        const now = new Date()

        // 1. Check active campaigns
        const campSnap = await getDocs(collection(db, 'campaigns'))
        const activeCampaign = campSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => {
            if (c.active === false) return false
            if (c.end_date) {
              const end = c.end_date.seconds ? new Date(c.end_date.seconds * 1000) : new Date(c.end_date)
              if (end < now) return false
            }
            if (c.start_date) {
              const start = c.start_date.seconds ? new Date(c.start_date.seconds * 1000) : new Date(c.start_date)
              if (start > now) return false
            }
            return true
          })
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0]

        if (activeCampaign) {
          setPopup({
            type: 'campaign',
            icon: HiSpeakerphone,
            title: activeCampaign.title,
            description: activeCampaign.description || activeCampaign.message || 'Check out our latest campaign!',
            cta: activeCampaign.cta || 'View Campaign',
            url: `/campaigns/${activeCampaign.id}`,
            color: '#3b82f6',
          })
          setVisible(true)
          localStorage.setItem(shownKey, 'true')
          return
        }

        // 2. Check active internships
        const internSnap = await getDocs(collection(db, 'internships'))
        const activeIntern = internSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(i => i.active !== false)
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0]

        if (activeIntern) {
          setPopup({
            type: 'internship',
            icon: HiAcademicCap,
            title: `Internship: ${activeIntern.title}`,
            description: activeIntern.description?.slice(0, 120) || 'We have open internship positions. Apply now!',
            cta: 'Apply Now',
            url: `/internships/${activeIntern.id}`,
            color: '#8b5cf6',
          })
          setVisible(true)
          localStorage.setItem(shownKey, 'true')
          return
        }

        // 3. Check active notifications
        const notifSnap = await getDocs(collection(db, 'notifications'))
        const activeNotif = notifSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(n => {
            if (n.active === false) return false
            if (n.expiry_date) {
              const expiry = n.expiry_date.seconds ? new Date(n.expiry_date.seconds * 1000) : new Date(n.expiry_date)
              if (expiry < now) return false
            }
            return true
          })
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0]

        if (activeNotif) {
          setPopup({
            type: 'notification',
            icon: HiBell,
            title: activeNotif.title,
            description: activeNotif.message || 'Check out our latest update!',
            cta: activeNotif.cta || 'Learn More',
            url: activeNotif.url || '/',
            color: '#06b6d4',
          })
          setVisible(true)
          localStorage.setItem(shownKey, 'true')
        }
      } catch {}
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => setVisible(false)

  return (
    <AnimatePresence>
      {visible && popup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #0d1127, #0a0e1a)',
              border: `1px solid ${popup.color}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${popup.color}15`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HiX className="w-4 h-4" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `${popup.color}15`, border: `1px solid ${popup.color}25` }}
            >
              <popup.icon className="w-7 h-7" style={{ color: popup.color }} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 px-4">{popup.title}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed px-2">
              {popup.description.length > 150 ? popup.description.slice(0, 150) + '...' : popup.description}
            </p>

            <div className="flex flex-col gap-2">
              <Link
                to={popup.url}
                onClick={handleClose}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${popup.color}, ${popup.color}cc)`, boxShadow: `0 8px 25px ${popup.color}30` }}
              >
                {popup.cta}
              </Link>
              <button
                onClick={handleClose}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors py-1"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
