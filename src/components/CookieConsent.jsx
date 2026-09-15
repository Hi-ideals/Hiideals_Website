import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiShieldCheck } from 'react-icons/hi'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false })

  useEffect(() => {
    const consent = localStorage.getItem('hiideals_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('hiideals_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() }))
    setShow(false)
  }

  const handleSavePrefs = () => {
    localStorage.setItem('hiideals_cookie_consent', JSON.stringify({ necessary: true, ...prefs, date: new Date().toISOString() }))
    setShow(false)
    setShowPrefs(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {!showPrefs && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed bottom-0 inset-x-0 z-[70] p-4">
              <div className="max-w-4xl mx-auto rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-200 shadow-xl">
                <div className="flex items-start gap-3 flex-1">
                  <HiShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">We use cookies to improve your experience. By continuing to use our site, you consent to our use of cookies.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setShowPrefs(true)} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 transition-colors">Manage</button>
                  <button onClick={handleAcceptAll} className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors">Accept All</button>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {showPrefs && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[75] flex items-center justify-center p-4" onClick={() => setShowPrefs(false)}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md rounded-2xl p-6 bg-white border border-gray-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowPrefs(false)} className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <HiX className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Cookie Preferences</h3>
                  <p className="text-xs text-gray-500 mb-5">Manage your cookie settings below.</p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div><p className="text-sm font-medium text-gray-900">Necessary</p><p className="text-xs text-gray-500">Required for the site to function</p></div>
                      <div className="w-10 h-5.5 rounded-full bg-emerald-100 flex items-center px-0.5 cursor-not-allowed"><div className="w-4.5 h-4.5 rounded-full bg-emerald-500 ml-auto" /></div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div><p className="text-sm font-medium text-gray-900">Analytics</p><p className="text-xs text-gray-500">Help us understand how you use our site</p></div>
                      <button onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} className="relative w-10 h-5.5 rounded-full transition-colors"
                        style={{ background: prefs.analytics ? '#0ea5e9' : '#e5e7eb' }}>
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow-sm ${prefs.analytics ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div><p className="text-sm font-medium text-gray-900">Marketing</p><p className="text-xs text-gray-500">Personalized content and ads</p></div>
                      <button onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))} className="relative w-10 h-5.5 rounded-full transition-colors"
                        style={{ background: prefs.marketing ? '#0ea5e9' : '#e5e7eb' }}>
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow-sm ${prefs.marketing ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <button onClick={handleSavePrefs} className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-sky-500 hover:bg-sky-600 transition-colors">Save Preferences</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
